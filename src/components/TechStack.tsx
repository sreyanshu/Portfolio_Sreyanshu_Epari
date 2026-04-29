import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Decal } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const imageURLs = [
  "/images/c.svg",
  "/images/java.svg",
  "/images/nmap.svg",
  "/images/opencv.svg",
  "/images/python.svg",
];
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);

const spheres = [...Array(30)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  texture: THREE.Texture;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  texture,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const initialRotation = useMemo(() => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number], []);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={initialRotation}
      >
        <Decal
          position={[0, 0, 1]}
          rotation={[0, 0, 0]}
          scale={1.4}
        >
          <meshPhysicalMaterial
            map={texture}
            polygonOffset
            polygonOffsetFactor={-1}
            transparent
            opacity={1}
            roughness={0.05}
            metalness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </Decal>
        <Decal
          position={[0, 0, -1]}
          rotation={[0, Math.PI, 0]}
          scale={1.4}
        >
          <meshPhysicalMaterial
            map={texture}
            polygonOffset
            polygonOffsetFactor={-1}
            transparent
            opacity={1}
            roughness={0.05}
            metalness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </Decal>
      </mesh>
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return imageURLs.map((url) => {
      const texture = loader.load(url);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });
  }, []);

  const baseMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0.1,
      roughness: 0.05, // Lower roughness for more smoothness
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      opacity: 1,
      transparent: false,
    });
  }, []);

  return (
    <div className="techstack">
      <h2> My Techstack</h2>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              texture={textures[Math.floor(Math.random() * textures.length)]}
              material={baseMaterial}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
