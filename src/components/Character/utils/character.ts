import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;

                // Clone material so we can color them individually
                if (mesh.material) {
                  // If it's an array of materials, handle it, though unlikely here
                  if (Array.isArray(mesh.material)) {
                    mesh.material = mesh.material.map(m => m.clone());
                  } else {
                    mesh.material = mesh.material.clone();
                  }

                  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
                  const nameStr = ((mesh.name || "") + " " + (mesh.parent?.name || "")).toLowerCase();
                  const matName = (mat as any).name || "";

                  // First, if the material is "default", we set it to Indian Yellow (this covers the face, ears, neck, hands)
                  if (matName === "default" || nameStr.includes("ear") || nameStr.includes("neck") || nameStr.includes("hand") || nameStr.includes("cube.002") || nameStr.includes("plane.007")) {
                    (mat as THREE.MeshStandardMaterial).color.set("#e3a857");
                  }

                  // Overrides for specific clothing and objects
                  if (nameStr.includes("shirt") || nameStr.includes("body.shirt")) {
                    (mat as THREE.MeshStandardMaterial).color.set("#7b00ff"); // Cyber Violet
                  }
                  if (nameStr.includes("pant")) {
                    (mat as THREE.MeshStandardMaterial).color.set("#111111"); // Black
                  }
                  if (nameStr.includes("shoe") || nameStr.includes("sole") || nameStr.includes("cylinder.005") || nameStr.includes("cylinder.008")) {
                    (mat as THREE.MeshStandardMaterial).color.set("#ffffff"); // White
                  }
                  if (nameStr.includes("plane.003") || nameStr.includes("plane.016")) {
                    // Check if it's not the ear (ear is Ear.001 but its mesh is Plane.003)
                    if (!nameStr.includes("ear")) {
                      (mat as THREE.MeshStandardMaterial).color.set("#8B5A2B"); // Wooden color
                    }
                  }
                }
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
