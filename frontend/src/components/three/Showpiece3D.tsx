import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Mesh, InstancedMesh, PointLight } from "three";

/* ────────────────────────────────────────────────────────────────────────────
   NEO — procedural assembly LINE showpiece.

   Modelled (by eye, from the client's SolidWorks renders) as a two-station
   automated cell:

     Station 1  servo press   — ball-screw ram, load cell, shuttle nest
     Transfer   pick & place  — overhead gantry with a vacuum/gripper head
     Station 2  vision check  — camera, ring light, pass/fail sorting
     Aux        balancer arm  — the pneumatic assist arm from the renders
                conveyors     — infeed + pass/reject outfeed

   One deterministic timeline (SEQ) drives every axis, so the gantry hands off
   to the press exactly when the press is clear, and the reject flap only
   fires on a part the vision stage actually failed. Nothing is random-looking
   filler — every motion is a step in a real cycle.

   Everything is generated in code — no GLB/CAD asset to download, so the
   section stays light and needs no art pipeline. If a real SolidWorks export
   ever lands, swap the station components for <useGLTF> nodes and keep the rig.
   ──────────────────────────────────────────────────────────────────────────── */

/* ── Shared materials ──────────────────────────────────────────────────────
   Built once at module scope: every extrusion/panel reuses the same instance,
   so the whole line costs a handful of materials instead of one per mesh.
   Colours are the Titanium & Pastel palette.

   NOTE on metalness: a pure-metal PBR surface has NO diffuse term — it shows
   only what it reflects. With point-lights alone that reads as near-black, so
   these sit around 0.6–0.78 and lean on the <Studio> environment below for
   their bright brushed-aluminium look, matching the client's renders. */
const MAT = {
  /** Brushed anodised aluminium — the extrusion frame. */
  extrusion: new THREE.MeshStandardMaterial({
    color: "#d9dde5",
    metalness: 0.68,
    roughness: 0.31,
  }),
  /** Lighter machined aluminium — decks, brackets, tooling. */
  alu: new THREE.MeshStandardMaterial({
    color: "#e8ebf0",
    metalness: 0.6,
    roughness: 0.26,
  }),
  /** Powder-coated sheet — cabinet doors, guards. */
  panel: new THREE.MeshStandardMaterial({
    color: "#eef1f5",
    metalness: 0.2,
    roughness: 0.58,
  }),
  /** Machined steel — ram, ball screw, guide columns. */
  steel: new THREE.MeshStandardMaterial({
    color: "#9aa3b0",
    metalness: 0.78,
    roughness: 0.24,
  }),
  /** Dark hard-anodised detail — rails, brackets, camera bodies. */
  dark: new THREE.MeshStandardMaterial({
    color: "#4c5563",
    metalness: 0.7,
    roughness: 0.35,
  }),
  /** Teal VFD / drive housings (the green-teal boxes in the renders). */
  drive: new THREE.MeshStandardMaterial({
    color: "#1d8f86",
    metalness: 0.45,
    roughness: 0.45,
    emissive: "#4fd9b4",
    emissiveIntensity: 0.16,
  }),
  /** Hydraulic reservoir — the periwinkle tank. */
  tank: new THREE.MeshStandardMaterial({
    color: "#7c86f0",
    metalness: 0.35,
    roughness: 0.5,
    emissive: "#7c86f0",
    emissiveIntensity: 0.1,
  }),
  /** Safety-orange accents on the balancer arm (as in the renders). */
  orange: new THREE.MeshStandardMaterial({
    color: "#e8863c",
    metalness: 0.3,
    roughness: 0.45,
  }),
  /** Conveyor belting. */
  belt: new THREE.MeshStandardMaterial({
    color: "#2b3140",
    metalness: 0.1,
    roughness: 0.85,
  }),
  /** Polycarbonate guarding. Kept very faint and NON-transmissive: real
      transmission re-renders the backdrop per panel (expensive) and stacked
      panes muddied the machine behind them. A light tinted film reads the
      same at this size and stays cheap. */
  guard: new THREE.MeshStandardMaterial({
    color: "#bfe4fa",
    metalness: 0.1,
    roughness: 0.14,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
    depthWrite: false,
  }),
  /** HMI screen face. */
  screen: new THREE.MeshStandardMaterial({
    color: "#0b1220",
    metalness: 0.2,
    roughness: 0.25,
    emissive: "#4fb6f0",
    emissiveIntensity: 0.55,
  }),
};

/** Pushbutton / stack-light lenses — emissive so they read as lit lamps. */
function lampMat(color: string, intensity = 1.6) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    metalness: 0.1,
    roughness: 0.3,
  });
}
const LAMP = {
  red: lampMat("#ff3b3b"),
  amber: lampMat("#ffb020"),
  green: lampMat("#3ddc84"),
  blue: lampMat("#4fb6f0"),
};

/* ── Primitives ──────────────────────────────────────────────────────────── */

/** One length of 40x40 aluminium extrusion, spanning `from` → `to`. */
function Beam({
  from,
  to,
  size = 0.075,
}: {
  from: [number, number, number];
  to: [number, number, number];
  size?: number;
}) {
  // Beams in this cell are axis-aligned, so the span is just the delta; the
  // two cross-section axes keep the stock size.
  const dims: [number, number, number] = [
    Math.abs(to[0] - from[0]) || size,
    Math.abs(to[1] - from[1]) || size,
    Math.abs(to[2] - from[2]) || size,
  ];
  const mid: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ];
  return (
    <mesh position={mid} material={MAT.extrusion}>
      <boxGeometry args={dims} />
    </mesh>
  );
}

function Box({
  pos,
  size,
  material,
  rotation,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  material: THREE.Material;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={pos} rotation={rotation} material={material}>
      <boxGeometry args={size} />
    </mesh>
  );
}

/** A lit pushbutton on a panel face. */
function Lamp({
  pos,
  mat,
  r = 0.035,
}: {
  pos: [number, number, number];
  mat: THREE.Material;
  r?: number;
}) {
  return (
    <mesh position={pos} rotation={[Math.PI / 2, 0, 0]} material={mat}>
      <cylinderGeometry args={[r, r, 0.03, 16]} />
    </mesh>
  );
}

/* ── The part being built ────────────────────────────────────────────────── */

/* Shared workpiece geometry. Sized deliberately large relative to the tooling:
   the product is what the whole animation is ABOUT, and at the panel's actual
   render size a scale-accurate part was a couple of pixels — invisible. A
   chunky flanged hub reads at a glance and still looks like something a press
   would work on. */
const PART_GEO = new THREE.CylinderGeometry(0.17, 0.19, 0.15, 30);
const FLANGE_GEO = new THREE.CylinderGeometry(0.22, 0.22, 0.035, 30);
const BOSS_GEO = new THREE.CylinderGeometry(0.075, 0.075, 0.1, 22);

/**
 * The workpiece. `state` colours it by where it is in the process, so you can
 * read the line's logic at a glance: raw → pressed → passed → rejected.
 */
function Workpiece({ state }: { state: React.MutableRefObject<number> }) {
  const body = useRef<Mesh>(null);
  const flange = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);

  // Lerped rather than switched, so the part visibly "becomes" finished under
  // the press instead of popping to a new colour on one frame.
  const target = useMemo(() => new THREE.Color(), []);
  const COLORS = useMemo(
    () => ({
      0: new THREE.Color("#9aa3b0"), // raw casting — dull grey
      1: new THREE.Color("#ed1c24"), // pressed — brand red
      2: new THREE.Color("#3ddc84"), // vision PASS
      3: new THREE.Color("#ffb020"), // vision REJECT
    }),
    []
  );

  useFrame(() => {
    target.copy(COLORS[(state.current as 0 | 1 | 2 | 3) ?? 0]);
    for (const r of [body, flange]) {
      const m = r.current?.material as THREE.MeshStandardMaterial | undefined;
      if (!m) continue;
      m.color.lerp(target, 0.09);
      m.emissive.lerp(target, 0.09);
    }
    // Ground halo picks up the same colour, so the part is legible even when a
    // machine partly occludes it.
    const hm = halo.current?.material as THREE.MeshBasicMaterial | undefined;
    if (hm) hm.color.lerp(target, 0.09);
  });

  return (
    <group>
      {/* Base flange */}
      <mesh ref={flange} geometry={FLANGE_GEO} position={[0, 0.018, 0]}>
        <meshStandardMaterial
          color="#9aa3b0"
          emissive="#9aa3b0"
          emissiveIntensity={0.3}
          metalness={0.55}
          roughness={0.35}
        />
      </mesh>
      {/* Hub body */}
      <mesh ref={body} geometry={PART_GEO} position={[0, 0.11, 0]}>
        <meshStandardMaterial
          color="#9aa3b0"
          emissive="#9aa3b0"
          emissiveIntensity={0.34}
          metalness={0.55}
          roughness={0.32}
        />
      </mesh>
      {/* The boss the press drives — steel, so it reads as a separate insert */}
      <mesh geometry={BOSS_GEO} position={[0, 0.235, 0]} material={MAT.steel} />
      {/* Soft halo disc under the part: a cheap "this is the product" marker
          that keeps it findable against a busy aluminium background. */}
      <mesh ref={halo} position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.33, 28]} />
        <meshBasicMaterial
          color="#9aa3b0"
          transparent
          opacity={0.16}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ── Station 1: the servo press ──────────────────────────────────────────── */

/** Height of the press assembly above the cell origin. Raised enough that the
    ram has a stroke you can actually see before the tool reaches the part —
    the stroke constants below are solved against this value. */
const PRESS_Y = 0.07;

/**
 * Ball-screw press column. The ram is driven by the parent rig via `ramRef`
 * so the press stroke stays in lock-step with the rest of the line.
 */
function PressColumn({
  ramRef,
  loadRef,
}: {
  ramRef: React.RefObject<Group>;
  loadRef: React.MutableRefObject<number>;
}) {
  const screw = useRef<Mesh>(null);
  const cell = useRef<Mesh>(null);

  useFrame((_, delta) => {
    // Screw pitch follows the ram: it spins fast on the rapid approach and
    // crawls under load, the way a real ball screw does.
    if (screw.current) screw.current.rotation.y += delta * (2 + 9 * (1 - loadRef.current));
    // Load cell glows as force builds — the "±2% Torque" badge made literal.
    const m = cell.current?.material as THREE.MeshStandardMaterial | undefined;
    if (m) m.emissiveIntensity = 0.15 + loadRef.current * 1.9;
  });

  return (
    <group position={[0, PRESS_Y, 0]}>
      {/* Servo motor + fan, standing proud of the roof on the gearbox — as in
          the client's renders, where the drive sits above the frame. */}
      <Box pos={[0, 1.16, 0]} size={[0.24, 0.28, 0.24]} material={MAT.steel} />
      <mesh position={[0, 1.34, 0]} material={MAT.drive}>
        <cylinderGeometry args={[0.09, 0.09, 0.1, 20]} />
      </mesh>

      {/* Ball screw */}
      <mesh ref={screw} position={[0, 0.66, 0]} material={MAT.steel}>
        <cylinderGeometry args={[0.045, 0.045, 0.82, 16]} />
      </mesh>

      {/* Guide columns either side */}
      {[-0.3, 0.3].map((px) => (
        <mesh key={px} position={[px, 0.66, 0]} material={MAT.steel}>
          <cylinderGeometry args={[0.028, 0.028, 0.82, 12]} />
        </mesh>
      ))}

      {/* Fixed head casting the screw runs through — kept under the roof rail */}
      <Box pos={[0, 0.98, 0]} size={[0.78, 0.09, 0.36]} material={MAT.alu} />

      {/* ── Moving ram (animated by the rig) ── */}
      <group ref={ramRef}>
        <Box pos={[0, 0.62, 0]} size={[0.72, 0.13, 0.34]} material={MAT.alu} />
        {/* Load cell */}
        <mesh ref={cell} position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.11, 16]} />
          <meshStandardMaterial
            color="#1d8f86"
            emissive="#4fd9b4"
            emissiveIntensity={0.15}
            metalness={0.45}
            roughness={0.4}
          />
        </mesh>
        {/* Press tool / punch */}
        <mesh position={[0, 0.38, 0]} material={MAT.steel}>
          <cylinderGeometry args={[0.035, 0.055, 0.16, 16]} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Weld/press sparks — a GPU-instanced burst fired at the moment of peak force.
 * Instanced so 40 particles cost one draw call; positions are integrated on
 * the CPU only while the burst is alive, then the mesh is hidden entirely.
 */
const SPARK_COUNT = 40;
function Sparks({ fire }: { fire: React.MutableRefObject<number> }) {
  const mesh = useRef<InstancedMesh>(null);
  const light = useRef<PointLight>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Deterministic pseudo-random directions: Math.random() is unavailable in
  // some contexts here and a fixed spray is reproducible frame to frame.
  const dirs = useMemo(
    () =>
      Array.from({ length: SPARK_COUNT }, (_, i) => {
        const a = (i / SPARK_COUNT) * Math.PI * 2 * 3.7;
        const s = 0.35 + ((i * 37) % 11) / 22;
        return new THREE.Vector3(Math.cos(a) * s, 0.5 + ((i * 13) % 7) / 12, Math.sin(a) * s);
      }),
    []
  );
  const life = useRef(0);

  useFrame((_, delta) => {
    if (fire.current > 0) {
      life.current = 1; // re-arm on the rig's trigger
      fire.current = 0;
    }
    const visible = life.current > 0;
    if (mesh.current) mesh.current.visible = visible;
    if (light.current) light.current.intensity = visible ? life.current * 8 : 0;
    if (!visible || !mesh.current) return;

    life.current = Math.max(0, life.current - delta * 1.7);
    const t = 1 - life.current; // 0 at ignition → 1 as it dies

    for (let i = 0; i < SPARK_COUNT; i++) {
      const d = dirs[i];
      // Ballistic: outward drift, gravity pulling the arc back down.
      dummy.position.set(d.x * t * 0.5, d.y * t * 0.34 - 1.6 * t * t * 0.28, d.z * t * 0.5);
      const s = Math.max(0.001, 0.016 * life.current);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, 0.09, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, SPARK_COUNT]} visible={false}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#ffd27a" toneMapped={false} />
      </instancedMesh>
      <pointLight ref={light} color="#ffb020" intensity={0} distance={1.6} />
    </group>
  );
}

/* ── Station 2: vision inspection ────────────────────────────────────────── */

/**
 * Vision station: camera on a post, a ring light that strobes on inspect, and
 * a nest the gantry drops the part into. `verdict` (2 = pass, 3 = reject) is
 * decided by the rig and shown on the little indicator.
 */
function VisionStation({
  scanRef,
  verdictRef,
}: {
  scanRef: React.MutableRefObject<number>;
  verdictRef: React.MutableRefObject<number>;
}) {
  const ring = useRef<Mesh>(null);
  const beam = useRef<Mesh>(null);
  const okLamp = useRef<Mesh>(null);
  const ngLamp = useRef<Mesh>(null);

  useFrame(() => {
    const s = scanRef.current; // 0..1 while inspecting
    const rm = ring.current?.material as THREE.MeshStandardMaterial | undefined;
    if (rm) rm.emissiveIntensity = 0.25 + s * 3.4;
    if (beam.current) {
      beam.current.visible = s > 0.02;
      const bm = beam.current.material as THREE.MeshBasicMaterial;
      bm.opacity = s * 0.22;
    }
    const set = (m: Mesh | null, on: boolean) => {
      const mm = m?.material as THREE.MeshStandardMaterial | undefined;
      if (mm) mm.emissiveIntensity += ((on ? 2.6 : 0.1) - mm.emissiveIntensity) * 0.12;
    };
    set(okLamp.current, verdictRef.current === 2);
    set(ngLamp.current, verdictRef.current === 3);
  });

  return (
    <group>
      {/* Camera post + head */}
      <Box pos={[0, 0.34, -0.18]} size={[0.06, 0.68, 0.06]} material={MAT.extrusion} />
      <Box pos={[0, 0.62, -0.02]} size={[0.14, 0.14, 0.26]} material={MAT.dark} />
      <mesh position={[0, 0.55, -0.02]} material={MAT.dark}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 16]} />
      </mesh>

      {/* Ring light under the lens — strobes when a part is inspected */}
      <mesh ref={ring} position={[0, 0.48, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.075, 0.018, 10, 26]} />
        <meshStandardMaterial
          color="#4fb6f0"
          emissive="#9fdcff"
          emissiveIntensity={0.25}
          toneMapped={false}
        />
      </mesh>

      {/* Inspection light cone */}
      <mesh ref={beam} position={[0, 0.27, -0.02]} visible={false}>
        <coneGeometry args={[0.17, 0.42, 20, 1, true]} />
        <meshBasicMaterial
          color="#bfe9ff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Nest the part lands in */}
      <Box pos={[0, 0.03, 0]} size={[0.34, 0.05, 0.3]} material={MAT.alu} />

      {/* PASS / FAIL indicators */}
      <mesh ref={okLamp} position={[0.17, 0.12, 0.12]}>
        <sphereGeometry args={[0.028, 14, 14]} />
        <meshStandardMaterial color="#3ddc84" emissive="#3ddc84" emissiveIntensity={0.1} />
      </mesh>
      <mesh ref={ngLamp} position={[0.17, 0.12, -0.02]}>
        <sphereGeometry args={[0.028, 14, 14]} />
        <meshStandardMaterial color="#ffb020" emissive="#ffb020" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

/* ── Transfer: overhead pick-and-place gantry ────────────────────────────── */

/**
 * Two-axis gantry. `carriage` travels in X along the beam, `head` strokes in Y.
 * The rig parents the part to `payload` while it's being carried, so the part
 * follows both axes for free.
 */
function Gantry({
  carriageRef,
  headRef,
  payloadRef,
  gripRef,
}: {
  carriageRef: React.RefObject<Group>;
  headRef: React.RefObject<Group>;
  payloadRef: React.RefObject<Group>;
  gripRef: React.MutableRefObject<number>;
}) {
  const jawL = useRef<Mesh>(null);
  const jawR = useRef<Mesh>(null);

  useFrame(() => {
    // Jaws close as gripRef → 1. Real motion, not a swap to a "holding" model.
    // Closed span is sized to the hub they actually grip (radius 0.19), so the
    // jaws land ON the part rather than passing through it.
    const g = gripRef.current;
    const open = 0.29 - g * 0.085;
    if (jawL.current) jawL.current.position.x = -open;
    if (jawR.current) jawR.current.position.x = open;
  });

  return (
    <group>
      {/* Gantry beam + linear rail, spanning infeed → outfeed with a little
          overrun at each end (the carriage travels X_INFEED..X_OUTFEED). */}
      <Box pos={[0.38, 1.5, -0.05]} size={[4.0, 0.1, 0.12]} material={MAT.extrusion} />
      <Box pos={[0.38, 1.42, -0.05]} size={[4.0, 0.04, 0.16]} material={MAT.dark} />
      {/* End posts carrying the beam down to the floor (-1.62), so the gantry
          is supported structure rather than a bar hanging in space. */}
      {[X_INFEED - 0.55, X_OUTFEED + 0.4].map((x) => (
        <group key={x}>
          <Box pos={[x, -0.06, -0.05]} size={[0.09, 3.12, 0.09]} material={MAT.extrusion} />
          <Box pos={[x, -1.59, -0.05]} size={[0.34, 0.06, 0.34]} material={MAT.panel} />
        </group>
      ))}

      <group ref={carriageRef}>
        {/* Carriage riding the beam */}
        <Box pos={[0, 1.44, 0.02]} size={[0.26, 0.16, 0.2]} material={MAT.alu} />
        <Box pos={[0, 1.55, 0.02]} size={[0.14, 0.1, 0.14]} material={MAT.drive} />

        {/* Vertical stroke */}
        <group ref={headRef}>
          <Box pos={[0, 1.14, 0.02]} size={[0.05, 0.5, 0.05]} material={MAT.steel} />
          {/* Gripper body, wide enough to carry the jaw travel */}
          <Box pos={[0, 0.93, 0.02]} size={[0.62, 0.09, 0.18]} material={MAT.alu} />
          {/* Gripper jaws — sized to close onto the hub, not disappear into it */}
          <mesh ref={jawL} position={[-0.29, 0.79, 0.02]} material={MAT.dark}>
            <boxGeometry args={[0.05, 0.2, 0.16]} />
          </mesh>
          <mesh ref={jawR} position={[0.29, 0.79, 0.02]} material={MAT.dark}>
            <boxGeometry args={[0.05, 0.2, 0.16]} />
          </mesh>
          {/* Whatever the gripper is holding hangs here */}
          <group ref={payloadRef} position={[0, 0.72, 0.02]} />
        </group>
      </group>
    </group>
  );
}

/* ── Aux: pneumatic balancer arm (renders 4 & 6) ─────────────────────────── */

/**
 * The pillar-mounted assist arm. It sweeps slowly and continuously — it's an
 * operator aid, not part of the timed cycle, so it reads as ambient motion
 * without competing with the press for attention.
 */
export function BalancerArm() {
  const yaw = useRef<Group>(null);
  const elbow = useRef<Group>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (yaw.current) yaw.current.rotation.y = Math.sin(t.current * 0.28) * 0.55 - 0.4;
    if (elbow.current) elbow.current.rotation.y = Math.sin(t.current * 0.28 + 1.1) * 0.42;
  });

  return (
    // Set BEHIND the line rather than beside it: at the showcase angle an arm
    // out to the left swept straight through the infeed conveyor. From back
    // here it reads as the operator's assist station serving the cell.
    <group position={[-1.95, -1.35, -1.5]}>
      {/* Base plate + pillar */}
      <Box pos={[0, 0.02, 0]} size={[0.5, 0.06, 0.5]} material={MAT.panel} />
      <mesh position={[0, 0.75, 0]} material={MAT.panel}>
        <cylinderGeometry args={[0.1, 0.13, 1.45, 20]} />
      </mesh>
      {/* Gusset */}
      <Box pos={[0, 0.2, 0.16]} size={[0.06, 0.3, 0.22]} material={MAT.panel} rotation={[0.5, 0, 0]} />
      {/* Control box on the pillar */}
      <Box pos={[0.13, 0.95, 0]} size={[0.06, 0.2, 0.14]} material={MAT.dark} />

      <group ref={yaw} position={[0, 1.5, 0]}>
        {/* Shoulder */}
        <mesh material={MAT.orange}>
          <cylinderGeometry args={[0.075, 0.075, 0.11, 16]} />
        </mesh>
        {/* Upper arm */}
        <Box pos={[0.42, 0, 0]} size={[0.85, 0.075, 0.075]} material={MAT.panel} />

        <group ref={elbow} position={[0.85, 0, 0]}>
          <mesh material={MAT.orange}>
            <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
          </mesh>
          {/* Forearm, angled down like the renders' spring-balanced link */}
          <Box
            pos={[0.3, -0.12, 0]}
            size={[0.68, 0.06, 0.06]}
            material={MAT.panel}
            rotation={[0, 0, -0.36]}
          />
          {/* Gas spring */}
          <mesh position={[0.28, -0.02, 0.07]} rotation={[0, 0, -0.36]} material={MAT.steel}>
            <cylinderGeometry args={[0.028, 0.028, 0.42, 12]} />
          </mesh>
          {/* Wrist + vacuum pad */}
          <group position={[0.62, -0.24, 0]}>
            <mesh material={MAT.orange}>
              <cylinderGeometry args={[0.045, 0.045, 0.08, 14]} />
            </mesh>
            <mesh position={[0, -0.18, 0]} material={MAT.steel}>
              <cylinderGeometry args={[0.022, 0.022, 0.3, 10]} />
            </mesh>
            <mesh position={[0, -0.35, 0]} material={MAT.dark}>
              <cylinderGeometry args={[0.11, 0.09, 0.05, 20]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ── Conveyors ───────────────────────────────────────────────────────────── */

/**
 * A belt conveyor. The belt surface scrolls via UV offset — far cheaper than
 * animating geometry, and it sells continuous motion between cycle steps.
 */
function Conveyor({
  pos,
  length = 1.2,
  speed = 0.35,
}: {
  pos: [number, number, number];
  length?: number;
  speed?: number;
}) {
  const belt = useRef<Mesh>(null);
  // A tiny procedural stripe texture, generated once — no image to download.
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 8;
    const g = c.getContext("2d");
    if (g) {
      g.fillStyle = "#2b3140";
      g.fillRect(0, 0, 64, 8);
      g.fillStyle = "#3c4456";
      for (let i = 0; i < 64; i += 16) g.fillRect(i, 0, 8, 8);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(6, 1);
    return t;
  }, []);

  useFrame((_, delta) => {
    tex.offset.x -= delta * speed;
  });

  useEffect(() => () => tex.dispose(), [tex]);

  return (
    <group position={pos}>
      {/* Side rails */}
      <Box pos={[0, 0.05, 0.15]} size={[length, 0.06, 0.03]} material={MAT.extrusion} />
      <Box pos={[0, 0.05, -0.15]} size={[length, 0.06, 0.03]} material={MAT.extrusion} />
      {/* Belt */}
      <mesh ref={belt} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, 0.28]} />
        <meshStandardMaterial map={tex} roughness={0.85} metalness={0.05} />
      </mesh>
      {/* End rollers */}
      {[-length / 2, length / 2].map((x) => (
        <mesh key={x} position={[x, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={MAT.steel}>
          <cylinderGeometry args={[0.045, 0.045, 0.3, 14]} />
        </mesh>
      ))}
      {/* Legs, run down to the same floor plane as the machines (-1.62 world;
          this group sits at -0.28) so the conveyors stand rather than hover. */}
      {[-length / 2 + 0.12, length / 2 - 0.12].map((x) => (
        <group key={x}>
          <Box pos={[x, -0.66, 0.11]} size={[0.05, 1.36, 0.05]} material={MAT.extrusion} />
          <Box pos={[x, -0.66, -0.11]} size={[0.05, 1.36, 0.05]} material={MAT.extrusion} />
          {/* Cross-tie so the pair reads as a frame, not two loose posts */}
          <Box pos={[x, -1.16, 0]} size={[0.04, 0.04, 0.24]} material={MAT.extrusion} />
        </group>
      ))}
    </group>
  );
}

/* ── Frame & fixed furniture ─────────────────────────────────────────────── */

/** The extrusion frame: lower base bay + guarded upper enclosure. */
function Frame() {
  const W = 2.0; // width  (x)
  const D = 0.9; // depth  (z)
  const yFoot = -1.35;
  const yDeck = -0.28; // work deck
  const yTop = 1.15;

  const x = W / 2;
  const z = D / 2;
  const corners: Array<[number, number]> = [
    [-x, -z],
    [x, -z],
    [-x, z],
    [x, z],
  ];

  return (
    <group>
      {/* Four uprights, floor → roof */}
      {corners.map(([px, pz], i) => (
        <Beam key={`up-${i}`} from={[px, yFoot, pz]} to={[px, yTop, pz]} />
      ))}

      {/* Horizontal rails at foot, deck and roof level */}
      {[yFoot, yDeck, yTop].map((y) => (
        <group key={y}>
          <Beam from={[-x, y, -z]} to={[x, y, -z]} />
          <Beam from={[-x, y, z]} to={[x, y, z]} />
          <Beam from={[-x, y, -z]} to={[-x, y, z]} />
          <Beam from={[x, y, -z]} to={[x, y, z]} />
        </group>
      ))}

      {/* Mid-height cross-brace on the rear face (as in the renders) */}
      <Beam from={[-x, 0.45, -z]} to={[x, 0.45, -z]} />

      {/* Levelling feet */}
      {corners.map(([px, pz], i) => (
        <mesh key={`foot-${i}`} position={[px, yFoot - 0.11, pz]} material={MAT.steel}>
          <cylinderGeometry args={[0.075, 0.095, 0.09, 14]} />
        </mesh>
      ))}

      {/* Work deck — the machined plate the tooling sits on */}
      <Box pos={[0, yDeck + 0.055, 0]} size={[W + 0.07, 0.05, D + 0.07]} material={MAT.alu} />

      {/* Rear + side polycarbonate guarding on the upper enclosure. The front
          is left open as the load aperture — that's where the shuttle indexes
          out to, and it keeps the press readable from the showcase angle. */}
      <mesh position={[0, 0.44, -z]} material={MAT.guard}>
        <planeGeometry args={[W, 1.4]} />
      </mesh>
      <mesh position={[-x, 0.44, 0]} rotation={[0, Math.PI / 2, 0]} material={MAT.guard}>
        <planeGeometry args={[D, 1.4]} />
      </mesh>
      <mesh position={[x, 0.44, 0]} rotation={[0, Math.PI / 2, 0]} material={MAT.guard}>
        <planeGeometry args={[D, 1.4]} />
      </mesh>
    </group>
  );
}

/** VFD / servo drive with a lit display — mirrored on both uprights. */
function Drive({ pos, flip = false }: { pos: [number, number, number]; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <group position={pos}>
      {/* Back-plate the drive bolts to (mirrors the renders' mounting rails) */}
      <Box pos={[0, 0, s * -0.11]} size={[0.36, 0.54, 0.03]} material={MAT.extrusion} />
      <Box pos={[0, 0, 0]} size={[0.3, 0.46, 0.2]} material={MAT.drive} />
      {/* Display face */}
      <mesh
        position={[0, 0.1, s * 0.105]}
        rotation={flip ? [0, Math.PI, 0] : undefined}
        material={MAT.screen}
      >
        <planeGeometry args={[0.2, 0.13]} />
      </mesh>
      {/* Cooling fins */}
      {[-0.09, -0.03, 0.03, 0.09].map((y) => (
        <Box key={y} pos={[0, y - 0.1, s * 0.1]} size={[0.24, 0.014, 0.02]} material={MAT.steel} />
      ))}
    </group>
  );
}

/**
 * Operator pendant with a LIVE HMI: the screen is a canvas texture the rig
 * redraws with the running part count, cycle stage and force bar — so the
 * panel shows the same process the machine is performing.
 */
function Pendant({ hud }: { hud: React.MutableRefObject<HudState> }) {
  const { canvas, tex, ctx } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return { canvas: c, tex: t, ctx: c.getContext("2d") };
  }, []);

  const last = useRef("");
  useFrame(() => {
    if (!ctx) return;
    const h = hud.current;
    // Only repaint when something actually changed — a canvas upload every
    // frame would cost more than the rest of the scene combined.
    const key = `${h.label}|${h.count}|${Math.round(h.force * 20)}|${h.verdict}`;
    if (key === last.current) return;
    last.current = key;

    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = "#4fb6f0";
    ctx.font = "bold 17px system-ui, sans-serif";
    ctx.fillText(h.label, 14, 30);

    ctx.fillStyle = "#7c86f0";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("PARTS", 14, 58);
    ctx.fillStyle = "#e8ebf0";
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillText(String(h.count).padStart(4, "0"), 14, 84);

    // Force bar
    ctx.fillStyle = "#7c86f0";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("FORCE", 142, 58);
    ctx.fillStyle = "#1b2436";
    ctx.fillRect(142, 66, 100, 14);
    ctx.fillStyle = h.force > 0.9 ? "#ed1c24" : "#3ddc84";
    ctx.fillRect(142, 66, Math.max(2, 100 * h.force), 14);

    // Verdict chip
    if (h.verdict) {
      ctx.fillStyle = h.verdict === "PASS" ? "#3ddc84" : "#ffb020";
      ctx.fillRect(142, 92, 100, 22);
      ctx.fillStyle = "#0b1220";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText(h.verdict, 168, 108);
    }

    tex.needsUpdate = true;
  });

  useEffect(() => () => tex.dispose(), [tex]);

  return (
    <group position={[0.78, 0.3, 0.42]} rotation={[-0.18, -0.42, 0]}>
      {/* Support arm back to the frame upright — without it the HMI floats. */}
      <Box
        pos={[0.16, -0.02, -0.13]}
        size={[0.42, 0.05, 0.05]}
        material={MAT.extrusion}
        rotation={[0, 0.42, 0]}
      />
      <Box pos={[0, 0, 0]} size={[0.46, 0.4, 0.09]} material={MAT.panel} />
      <mesh position={[0, 0.07, 0.05]}>
        <planeGeometry args={[0.34, 0.18]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <Lamp pos={[-0.13, -0.11, 0.055]} mat={LAMP.red} />
      <Lamp pos={[-0.02, -0.11, 0.055]} mat={LAMP.green} />
      <Lamp pos={[0.09, -0.11, 0.055]} mat={LAMP.blue} />
      {/* E-stop mushroom */}
      <mesh position={[0.18, -0.11, 0.06]} rotation={[Math.PI / 2, 0, 0]} material={LAMP.red}>
        <cylinderGeometry args={[0.05, 0.045, 0.04, 16]} />
      </mesh>
    </group>
  );
}

/** Andon stack light — amber idle, red under press, green on a good part. */
function StackLight({ stage }: { stage: React.MutableRefObject<number> }) {
  const red = useRef<Mesh>(null);
  const amber = useRef<Mesh>(null);
  const green = useRef<Mesh>(null);

  useFrame(() => {
    const s = stage.current;
    const set = (m: Mesh | null, on: boolean) => {
      if (!m) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      // Ease rather than snap, so the tower glows up like a real lamp.
      mat.emissiveIntensity += ((on ? 2.4 : 0.12) - mat.emissiveIntensity) * 0.12;
    };
    set(red.current, s === 1);
    set(amber.current, s === 0);
    set(green.current, s === 2);
  });

  const lenses: Array<{ ref: React.RefObject<Mesh>; y: number; c: string }> = [
    { ref: green, y: 0.2, c: "#3ddc84" },
    { ref: amber, y: 0.29, c: "#ffb020" },
    { ref: red, y: 0.38, c: "#ff3b3b" },
  ];

  return (
    // Sat on the rear roof rail (z = -0.45) so it has something to bolt to.
    <group position={[0.55, 1.19, -0.45]}>
      <mesh position={[0, 0.02, 0]} material={MAT.steel}>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 14]} />
      </mesh>
      <mesh position={[0, 0.09, 0]} material={MAT.steel}>
        <cylinderGeometry args={[0.022, 0.022, 0.14, 12]} />
      </mesh>
      {lenses.map(({ ref, y, c }) => (
        <mesh key={y} ref={ref} position={[0, y, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.085, 18]} />
          <meshStandardMaterial
            color={c}
            emissive={c}
            emissiveIntensity={0.12}
            metalness={0.1}
            roughness={0.35}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Lower bay: hydraulic power pack + control cabinet. */
function LowerBay() {
  return (
    <group>
      {/* Hydraulic reservoir */}
      <Box pos={[-0.62, -0.95, 0]} size={[0.62, 0.52, 0.5]} material={MAT.tank} />
      {/* Pump + motor on the tank lid */}
      <mesh position={[-0.62, -0.6, 0]} rotation={[0, 0, Math.PI / 2]} material={MAT.drive}>
        <cylinderGeometry args={[0.12, 0.12, 0.32, 20]} />
      </mesh>
      <Box pos={[-0.34, -0.64, 0]} size={[0.16, 0.16, 0.2]} material={MAT.steel} />
      {/* Manifold block */}
      <Box pos={[-0.85, -0.63, 0.1]} size={[0.14, 0.14, 0.14]} material={MAT.steel} />

      {/* Control cabinet with its lamp row */}
      <Box pos={[0.66, -0.86, 0]} size={[0.9, 0.72, 0.62]} material={MAT.panel} />
      <Lamp pos={[0.44, -0.66, 0.315]} mat={LAMP.red} r={0.04} />
      <Lamp pos={[0.66, -0.66, 0.315]} mat={LAMP.green} r={0.04} />
      <Lamp pos={[0.88, -0.66, 0.315]} mat={LAMP.amber} r={0.04} />
      {/* Viewing window / door detail */}
      <Box pos={[0.66, -1.02, 0.32]} size={[0.34, 0.13, 0.02]} material={MAT.screen} />
    </group>
  );
}

/**
 * Shuttle table — the part carrier at the press. Slides out to load, in to
 * press, out to unload. Driven by the rig through `tableRef`; the part itself
 * is parented into `nestRef` when the gantry lets go of it.
 */
function ShuttleTable({
  tableRef,
  nestRef,
}: {
  tableRef: React.RefObject<Group>;
  nestRef: React.RefObject<Group>;
}) {
  return (
    <group position={[0, -0.14, 0]}>
      {/* Linear rail it runs on — runs front-to-back (z), the travel axis, and
          stays inside the frame depth so nothing overhangs the deck. */}
      <Box pos={[0, -0.035, 0.12]} size={[0.5, 0.035, 1.0]} material={MAT.steel} />
      {/* Bolster block the press reacts against */}
      <Box pos={[0, 0.0, -0.3]} size={[0.5, 0.09, 0.3]} material={MAT.alu} />

      <group ref={tableRef}>
        {/* Nest plate */}
        <Box pos={[0, 0.04, 0]} size={[0.44, 0.05, 0.34]} material={MAT.alu} />
        {/* Location pins */}
        {[-0.14, 0.14].map((px) => (
          <mesh key={px} position={[px, 0.09, 0.11]} material={MAT.steel}>
            <cylinderGeometry args={[0.016, 0.016, 0.07, 10]} />
          </mesh>
        ))}
        {/* Where the workpiece sits while it's on this table */}
        <group ref={nestRef} position={[0, 0.065, 0]} />
      </group>
    </group>
  );
}

/* ── The rig: one deterministic timeline drives the whole line ───────────── */

type HudState = { label: string; count: number; force: number; verdict: string };

/** Station X positions along the line. Kept tight: the panel is square, so a
    wider line just forces the camera back and shrinks the press — the piece
    everyone actually looks at. */
const X_INFEED = -1.42;
const X_PRESS = 0;
const X_VISION = 1.45;
const X_OUTFEED = 2.18;

/* Press stroke, solved against the real geometry rather than eyeballed.

   Tool tip at rest (world Y):
     PressColumn group (PRESS_Y) + punch centre (0.38) - half its height (0.08)
   Boss top (world Y):
     ShuttleTable group (-0.14) + nest (0.065) + boss centre (0.235)
                                              + half its height (0.05)

   The ram must travel the gap between them — no further, or the punch drives
   through the part, the nest plate and the deck. A hair of overlap is kept so
   it reads as seated under load rather than hovering. */
const TIP_REST = PRESS_Y + 0.38 - 0.16 / 2;
const BOSS_TOP = -0.14 + 0.065 + 0.235 + 0.1 / 2;
const SEAT = 0.014; // press-in depth once it makes contact
const APPROACH = TIP_REST - BOSS_TOP; // free travel before contact
const STROKE = APPROACH + SEAT; // total ram travel (positive number)

/** Full line cycle. Every timing below is a beat inside this window. */
const CYCLE = 13.0;

/* Gantry plunge depths, solved per station rather than shared.

   The payload anchor hangs at y 0.72 inside the head group, and a part is
   re-parented WITHOUT moving in world space — so if the head doesn't descend
   the exact distance to a fixture, the released part floats above it. Each
   station sits at a different height, so each gets its own depth:

     press nest   -0.140 + 0.065 = -0.075
     vision nest  -0.220 + 0.055 = -0.165
     infeed belt  -0.280 + 0.060 = -0.220                                   */
const PAYLOAD_REST = 0.72;
const PLUNGE_PRESS = -0.14 + 0.065 - PAYLOAD_REST; // -0.795
const PLUNGE_VISION = -0.22 + 0.055 - PAYLOAD_REST; // -0.885
const PLUNGE_INFEED = -0.28 + 0.06 - PAYLOAD_REST; // -0.940

/** Smoothstep — eases each axis move in and out like a real servo profile. */
function ss(a: number, b: number, x: number) {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
}
/** Map t through a smoothstep window onto [from → to]. */
function lerpAt(from: number, to: number, a: number, b: number, t: number) {
  return from + (to - from) * ss(a, b, t);
}

function ProductionLine({ hud }: { hud: React.MutableRefObject<HudState> }) {
  const root = useRef<Group>(null);
  const ram = useRef<Group>(null);
  const table = useRef<Group>(null);
  const nest = useRef<Group>(null);
  const carriage = useRef<Group>(null);
  const head = useRef<Group>(null);
  const payload = useRef<Group>(null);
  const partHolder = useRef<Group>(null);
  const visionNest = useRef<Group>(null);
  const rejectFlap = useRef<Group>(null);

  const stage = useRef(0);
  const grip = useRef(0);
  const load = useRef(0);
  const scan = useRef(0);
  const verdict = useRef(0);
  const partState = useRef(0);
  const fire = useRef(0);
  const t = useRef(0);
  const turn = useRef(0);
  const count = useRef(0);
  const lastCycle = useRef(0);

  /**
   * Hand the part to a fixture. Uses `.add()`, NOT `.attach()`.
   *
   * `.attach()` preserves the object's WORLD transform — which is the opposite
   * of what a hand-off needs. With it the part never actually moved into a
   * nest: it stayed wherever it happened to be and only changed parent, so it
   * sank below the work deck (y ≈ -0.7, inside the lower bay behind the
   * cabinet) and drifted a little further every cycle. `.add()` re-parents and
   * lets the parent's transform place it, so the part snaps into each
   * fixture's local origin — the gripper, the press nest, the vision nest.
   */
  const attach = (target: Group | null) => {
    const p = partHolder.current;
    if (!p || !target || p.parent === target) return;
    target.add(p);
    p.position.set(0, 0, 0);
    p.rotation.set(0, 0, 0);
  };

  useFrame((_, delta) => {
    t.current += delta;
    const p = t.current % CYCLE;

    // A new cycle rolled over — bank the finished part.
    const cyc = Math.floor(t.current / CYCLE);
    if (cyc !== lastCycle.current) {
      lastCycle.current = cyc;
      count.current += 1;
    }

    /* ── 0.0–1.8  gantry travels to infeed and picks a raw part ───────────── */
    /* ── 1.8–3.4  carries it to the press and releases into the nest ─────── */
    /* ── 3.4–7.2  press cycle (shuttle in, stroke, dwell, retract, out) ──── */
    /* ── 7.2–9.0  gantry picks the pressed part, moves to vision ─────────── */
    /* ── 9.0–11.0 inspect, verdict ───────────────────────────────────────── */
    /* ──11.0–13.0 place on outfeed, reject flap if it failed ─────────────── */

    // Gantry X
    let gx: number;
    if (p < 1.4) gx = lerpAt(X_VISION, X_INFEED, 0, 1.4, p);
    else if (p < 2.0) gx = X_INFEED;
    else if (p < 3.2) gx = lerpAt(X_INFEED, X_PRESS, 2.0, 3.2, p);
    else if (p < 7.6) gx = X_PRESS;
    else if (p < 8.9) gx = lerpAt(X_PRESS, X_VISION, 7.6, 8.9, p);
    else if (p < 11.1) gx = X_VISION;
    else gx = lerpAt(X_VISION, X_OUTFEED, 11.1, 12.3, p);
    if (carriage.current) carriage.current.position.x = gx;

    /* Gantry Y — one down-and-up dip per pick or place, each to the depth its
       own station needs (see the PLUNGE_* constants above). */
    const dip = (depth: number, downA: number, downB: number, upA: number, upB: number) =>
      depth * (p < downB ? ss(downA, downB, p) : 1 - ss(upA, upB, p));

    let gy = 0;
    if (p >= 1.3 && p < 2.05) gy = dip(PLUNGE_INFEED, 1.3, 1.65, 1.75, 2.05); // pick raw
    else if (p >= 3.05 && p < 3.75) gy = dip(PLUNGE_PRESS, 3.05, 3.35, 3.5, 3.75); // place at press
    else if (p >= 7.0 && p < 7.75) gy = dip(PLUNGE_PRESS, 7.0, 7.3, 7.5, 7.75); // pick pressed
    else if (p >= 8.75 && p < 9.4) gy = dip(PLUNGE_VISION, 8.75, 9.0, 9.2, 9.4); // place at vision
    else if (p >= 12.2) gy = PLUNGE_VISION * ss(12.2, 12.6, p); // pick for outfeed
    if (head.current) head.current.position.y = gy;

    // Gripper: closed while carrying
    const carrying = (p >= 1.62 && p < 3.42) || (p >= 7.27 && p < 9.05) || p >= 12.45;
    grip.current += ((carrying ? 1 : 0) - grip.current) * 0.22;

    /* Hand-offs. Re-parenting (not copying coordinates) is what makes the part
       ride the gantry through both axes and then genuinely sit in a nest. */
    if (p < 1.62) attach(visionNest.current); // waiting at vision/outfeed
    else if (p < 3.42) attach(payload.current); // on the gantry → press
    else if (p < 7.27) attach(nest.current); // in the press nest
    else if (p < 9.05) attach(payload.current); // on the gantry → vision
    else attach(visionNest.current); // at the vision station

    /* Shuttle: parked out front (z = +0.42) to load, back to centre to press. */
    let z = 0.42;
    if (p < 3.6) z = 0.42;
    else if (p < 4.3) z = 0.42 * (1 - ss(3.6, 4.3, p)); // index in
    else if (p < 6.5) z = 0; // under the tool
    else if (p < 7.1) z = 0.42 * ss(6.5, 7.1, p); // index out
    if (table.current) table.current.position.z = z;

    /* Ram: fast approach down to contact, slow press into the boss, dwell at
       force, fast retract. Travel comes from the solved constants above, so
       the punch seats on the part instead of passing through it. */
    let y = 0;
    let force = 0;
    if (p < 4.4) y = 0;
    else if (p < 4.95) y = -APPROACH * ss(4.4, 4.95, p); // rapid approach
    else if (p < 5.5) {
      const k = ss(4.95, 5.5, p);
      y = -APPROACH - SEAT * k;
      force = k;
    } else if (p < 5.95) {
      y = -STROKE; // dwell at full load
      force = 1;
    } else if (p < 6.45) {
      y = -STROKE * (1 - ss(5.95, 6.45, p)); // retract
      force = 1 - ss(5.95, 6.2, p);
    }
    if (ram.current) ram.current.position.y = y;
    load.current = force;

    // Spark burst at the instant peak force is reached, and the part is made.
    if (p >= 5.48 && p < 5.48 + delta) {
      fire.current = 1;
      partState.current = 1; // raw → pressed
    }

    /* Vision: strobe the ring light while inspecting, then latch a verdict.
       Deterministic (every 4th part fails) rather than random — a repeating
       line should look like a real process, not a coin flip. */
    scan.current = p >= 9.5 && p < 10.6 ? Math.min(1, (p - 9.5) * 3) : 0;
    if (p >= 10.6) {
      const fail = count.current % 4 === 3;
      verdict.current = fail ? 3 : 2;
      partState.current = fail ? 3 : 2;
    } else if (p < 1.0) {
      verdict.current = 0;
      partState.current = 0; // fresh raw part for the new cycle
    }

    // Reject flap kicks only on a failed part, as it reaches the outfeed.
    const rejecting = verdict.current === 3 && p >= 12.4;
    if (rejectFlap.current) {
      rejectFlap.current.rotation.z +=
        ((rejecting ? -0.9 : 0) - rejectFlap.current.rotation.z) * 0.18;
    }

    /* Andon: red under load, green on a pass, amber otherwise. */
    stage.current = force > 0.05 ? 1 : verdict.current === 2 ? 2 : 0;

    /* Live HMI text. */
    hud.current.count = count.current;
    hud.current.force = force;
    hud.current.verdict = verdict.current === 2 ? "PASS" : verdict.current === 3 ? "REJECT" : "";
    hud.current.label =
      p < 3.4 ? "LOADING" : p < 7.1 ? "PRESSING" : p < 10.6 ? "INSPECT" : "UNLOAD";

    /* Showcase sweep rather than a full turntable. A 360° spin puts the line
       edge-on for a third of every revolution, where the frames collapse to
       slivers and the press hides behind an upright. Instead it eases through
       a shallow arc about the front three-quarter view — always readable. */
    turn.current += delta;
    if (root.current) root.current.rotation.y = 0.1 + Math.sin(turn.current * 0.19) * 0.4;
  });

  return (
    <group ref={root} position={[0, 0.12, 0]}>
      {/* Station 1 — the press cell */}
      <group position={[X_PRESS, 0, 0]}>
        <Frame />
        <LowerBay />
        <PressColumn ramRef={ram} loadRef={load} />
        <ShuttleTable tableRef={table} nestRef={nest} />
        <Drive pos={[-0.72, 0.5, 0.42]} />
        <Drive pos={[0.9, 0.5, -0.42]} flip />
        <Pendant hud={hud} />
        <StackLight stage={stage} />
        <Sparks fire={fire} />
      </group>

      {/* Station 2 — vision inspection, on its own bench */}
      <group position={[X_VISION, -0.22, 0]}>
        <Box pos={[0, -0.06, 0]} size={[0.8, 0.06, 0.66]} material={MAT.alu} />
        {/* Legs sized to actually reach the floor plane the contact shadow is
            cast on (-1.62 world); the bench sits at -0.22, so 1.31 tall,
            centred 0.745 below the group origin. Left shorter they dangled. */}
        {[
          [-0.32, -0.24],
          [0.32, -0.24],
          [-0.32, 0.24],
          [0.32, 0.24],
        ].map(([bx, bz], i) => (
          <Box key={i} pos={[bx, -0.745, bz]} size={[0.06, 1.31, 0.06]} material={MAT.extrusion} />
        ))}
        <VisionStation scanRef={scan} verdictRef={verdict} />
        {/* Where a part rests at this station */}
        <group ref={visionNest} position={[0, 0.055, 0]} />
      </group>

      {/* Conveyors: raw parts in, finished parts out */}
      <Conveyor pos={[X_INFEED, -0.28, 0]} length={1.5} speed={0.3} />
      <Conveyor pos={[X_OUTFEED, -0.28, 0]} length={1.1} speed={0.45} />

      {/* Reject diverter at the end of the outfeed */}
      <group ref={rejectFlap} position={[X_OUTFEED + 0.5, -0.2, 0]}>
        <Box pos={[0.12, 0, 0]} size={[0.26, 0.04, 0.3]} material={MAT.orange} />
      </group>

      {/* Overhead transfer gantry spanning both stations */}
      <Gantry
        carriageRef={carriage}
        headRef={head}
        payloadRef={payload}
        gripRef={grip}
      />

      {/* The single part that travels the whole line */}
      <group ref={partHolder}>
        <Workpiece state={partState} />
      </group>

      {/* NOTE: the pneumatic balancer arm from the client's renders is modelled
          (<BalancerArm/>) but left OUT of this scene. It's a standalone
          operator station, and at every angle in the showcase sweep its reach
          swept through the infeed conveyor or the gantry post. It stays in the
          file so a dedicated balancer-arm showpiece can mount it directly. */}
    </group>
  );
}

/** Faint wireframe shell — kept from the old showpiece as the "scan" motif. */
function Cage() {
  const cage = useRef<Group>(null);
  useFrame((_, delta) => {
    if (cage.current) {
      cage.current.rotation.y -= delta * 0.07;
      cage.current.rotation.z += delta * 0.03;
    }
  });
  const geo = useMemo(() => new THREE.IcosahedronGeometry(4.1, 1), []);
  return (
    <group ref={cage}>
      <mesh geometry={geo}>
        <meshBasicMaterial color="#7c86f0" wireframe transparent opacity={0.13} />
      </mesh>
    </group>
  );
}

/**
 * Studio environment built from Lightformers rather than an .hdr file — the
 * metal needs something to REFLECT (see the metalness note on MAT), and this
 * gives it a soft-box rig with zero extra network payload. `frames={1}` bakes
 * the cube-map once instead of re-rendering it every frame.
 */
function Studio() {
  return (
    <Environment frames={1} resolution={128}>
      {/* Big overhead soft-box — the main sheen down the extrusions */}
      <Lightformer intensity={2.2} position={[0, 5, 0]} scale={[9, 9, 1]} rotation-x={Math.PI / 2} color="#ffffff" />
      {/* Pastel side panels: periwinkle left, sky right, mint behind */}
      <Lightformer intensity={1.6} position={[-5, 1, 2]} scale={[6, 6, 1]} rotation-y={Math.PI / 2} color="#aab2ff" />
      <Lightformer intensity={1.5} position={[5, 0, 2]} scale={[6, 6, 1]} rotation-y={-Math.PI / 2} color="#8fd2f7" />
      <Lightformer intensity={1.1} position={[0, 1, -6]} scale={[8, 5, 1]} color="#8ff0d4" />
      {/* Cool floor bounce so the underside isn't a void */}
      <Lightformer intensity={0.7} position={[0, -5, 0]} scale={[9, 9, 1]} rotation-x={-Math.PI / 2} color="#5a6478" />
    </Environment>
  );
}

/**
 * Frames the whole line in view regardless of the panel's aspect ratio. The
 * cell is ~6 units wide; on a narrow phone column a fixed camera either
 * cropped the conveyors or left the machine tiny, so the dolly distance is
 * derived from the viewport instead of hard-coded.
 */
function Rig() {
  const { camera, viewport } = useThree();
  useEffect(() => {
    // The line spans roughly x -2.9 → +2.8 and y -1.7 → +1.6. Pull back just
    // far enough to hold that box, biased so the press cell (the centrepiece)
    // stays large; a narrow column needs more distance than a wide one.
    const aspect = viewport.width / viewport.height;
    const dist = THREE.MathUtils.clamp(9.9 / Math.max(aspect, 0.72), 8.8, 15.0);
    camera.position.set(dist * 0.26, dist * 0.2, dist);
    // Aimed a little right of the press and above the deck: the gantry and
    // outfeed extend further right than the infeed does left, and the tall
    // gantry posts need headroom the empty floor below does not.
    camera.lookAt(0.34, -0.05, 0);
    camera.updateProjectionMatrix();
  }, [camera, viewport.width, viewport.height]);
  return null;
}

function Scene({ hud }: { hud: React.MutableRefObject<HudState> }) {
  return (
    <>
      <Rig />
      <Studio />
      {/* The line floats gently inside the cage — same motion language as the
          previous showpiece, just wrapped around real machinery now. */}
      <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.35}>
        <ProductionLine hud={hud} />
      </Float>
      {/* Grounds the machines so they don't read as pasted onto the panel. */}
      <ContactShadows
        position={[0, -1.62, 0]}
        opacity={0.4}
        scale={12}
        blur={2.8}
        far={3.5}
        resolution={256}
        color="#000000"
      />
      <Cage />
    </>
  );
}

/**
 * The 3D canvas is GPU-heavy. R3F renders continuously by default — even while
 * this section is scrolled out of view — which steals the GPU from the hero
 * video and makes it stutter. So we:
 *   • only MOUNT the Canvas once the section has scrolled near the viewport,
 *   • set frameloop to "never" whenever it's off-screen (paused, no rendering),
 *   • and honour prefers-reduced-motion by rendering a single static frame.
 */
export function Showpiece3D({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const hud = useRef<HudState>({ label: "READY", count: 0, force: 0, verdict: "" });

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { rootMargin: "120px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {seen && (
        <Canvas
          frameloop={reduced ? "demand" : inView ? "always" : "never"}
          dpr={[1, 1.5]}
          camera={{ position: [3.2, 2.8, 9.4], fov: 34 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            {/* The <Studio> env supplies the base illumination and all the
                metal reflections; these just add directional shape and the
                pastel rim accents on top of it. */}
            <ambientLight intensity={0.45} />
            <directionalLight position={[5, 6, 5]} intensity={0.9} />
            <directionalLight position={[-4, 3, -4]} intensity={0.35} />
            {/* Pastel rim lights (periwinkle · sky · mint) + a subtle red kiss */}
            <pointLight position={[-4, 2, 3]} intensity={16} color="#7c86f0" />
            <pointLight position={[4, -1, 3]} intensity={14} color="#4fb6f0" />
            <pointLight position={[2, 3.5, -1]} intensity={12} color="#4fd9b4" />
            <pointLight position={[-2, -2.5, 1]} intensity={9} color="#ed1c24" />
            <Scene hud={hud} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
