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
          <meshStandardMaterial
            color="#1a1a1f"
            metalness={1}
            roughness={0.18}
            envMapIntensity={0.6}
          />
        </TorusKnot>
      </Float>

      <group ref={cage}>
        <Icosahedron args={[1.9, 1]}>
          <meshBasicMaterial color="#ed1c24" wireframe transparent opacity={0.18} />
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
            <ambientLight intensity={0.35} />
            <directionalLight position={[5, 5, 5]} intensity={1.4} />
            <pointLight position={[-4, 2, 3]} intensity={40} color="#ed1c24" />
            <pointLight position={[4, -2, 2]} intensity={30} color="#22b8ff" />
            <pointLight position={[0, 3, -4]} intensity={20} color="#ffffff" />
            <Core />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
