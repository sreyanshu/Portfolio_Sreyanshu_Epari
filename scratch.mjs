import fs from 'fs/promises';
import { webcrypto as crypto } from 'crypto';

async function decrypt() {
  const encryptedData = await fs.readFile('./public/models/character.enc');
  const iv = encryptedData.subarray(0, 16);
  const data = encryptedData.subarray(16);
  
  const password = "Character3D#@";
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
  
  const key = await crypto.subtle.importKey(
    "raw",
    hashedPassword.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
  
  const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
  const buffer = Buffer.from(decrypted);
  
  const chunkLength = buffer.readUInt32LE(12);
  const chunkType = buffer.toString('utf8', 16, 20);
  
  if (chunkType === 'JSON') {
    const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonStr);
    
    // Create node -> mesh mapping
    const nodeToMesh = {};
    if (gltf.nodes) {
      gltf.nodes.forEach((n, i) => {
        if (n.mesh !== undefined) nodeToMesh[n.mesh] = n.name;
      });
    }

    gltf.meshes.forEach((m, i) => {
      const nodeName = nodeToMesh[i] || m.name;
      const primitives = m.primitives || [];
      primitives.forEach(p => {
        const matIdx = p.material;
        const matName = matIdx !== undefined ? gltf.materials[matIdx].name : "None";
        console.log(`Node: ${nodeName} (Mesh: ${m.name}) uses material: ${matName}`);
      });
    });
  }
}

decrypt().catch(console.error);
