import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, TorusKnot } from "@react-three/drei";
import type { Mesh, Group } from "three";

function Core() {
  const knot = useRef<Mesh>(null);
  const cage = useRef<Group>(null);

  useFrame((_, delta) => {
    if (knot.current) {
      knot.current.rotation.x += delta * 0.18;
      knot.current.rotation.y += delta * 0.25;
    }
    if (cage.current) {
      cage.current.rotation.y -= delta * 0.12;
      cage.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
        <TorusKnot ref={knot} args={[0.85, 0.28, 200, 32]}>
          {/* Brushed-titanium base that catches the pastel point-lights as
              cool periwinkle/sky/mint streaks — reads as polished chrome/
              titanium in BOTH themes (no env-map needed, so no HDR to load). */}
          <meshStandardMaterial
            color="#cbd2de"
            metalness={0.94}
            roughness={0.22}
            emissive="#7c86f0"
            emissiveIntensity={0.12}
          />
        </TorusKnot>
      </Float>

      <group ref={cage}>
        <Icosahedron args={[1.9, 1]}>
          <meshBasicMaterial color="#7c86f0" wireframe transparent opacity={0.22} />
        </Icosahedron>
      </group>
    </group>
  );
}

/**
 * The 3D canvas is GPU-heavy. R3F renders continuously by default — even while
 * this section is scrolled out of view — which steals the GPU from the hero
 * video and makes it stutter. So we:
 *   • only MOUNT the Canvas once the section has scrolled near the viewport, and
 *   • set frameloop to "never" whenever it's off-screen (paused, no rendering).
 * Result: while you're watching the banner video at the top, this does nothing.
 */
export function Showpiece3D({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);

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
          frameloop={inView ? "always" : "never"}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.55} />
            <directionalLight position={[5, 5, 5]} intensity={1.3} />
            {/* Pastel rim lights (periwinkle · sky · mint) + a subtle red kiss */}
            <pointLight position={[-4, 2, 3]} intensity={45} color="#7c86f0" />
            <pointLight position={[4, -2, 2]} intensity={42} color="#4fb6f0" />
            <pointLight position={[2, 3, -1]} intensity={34} color="#4fd9b4" />
            <pointLight position={[-2, -3, 1]} intensity={16} color="#ed1c24" />
            <pointLight position={[0, 3, -4]} intensity={18} color="#ffffff" />
            <Core />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
