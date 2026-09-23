import * as THREE from 'three';

/**
 * Lightweight, robust .obj 3D file parser for client-side custom 3D model loading
 */
export function parseOBJ(text: string): THREE.BufferGeometry {
  const lines = text.split('\n');
  const vertices: number[][] = [];
  const vertexIndices: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;

    const parts = line.split(/\s+/);
    const type = parts[0];

    if (type === 'v') {
      // Vertex position
      vertices.push([
        parseFloat(parts[1]),
        parseFloat(parts[2]),
        parseFloat(parts[3]),
      ]);
    } else if (type === 'f') {
      // Face
      // Format can be: v, v/vt, v/vt/vn, v//vn
      const faceIndices: number[] = [];
      for (let j = 1; j < parts.length; j++) {
        const seg = parts[j].split('/')[0];
        let idx = parseInt(seg, 10);
        if (idx < 0) {
          idx = vertices.length + idx; // negative index
        } else {
          idx = idx - 1; // 1-based index to 0-based
        }
        faceIndices.push(idx);
      }

      // Triangulate n-gons (fan triangulation)
      for (let k = 1; k < faceIndices.length - 1; k++) {
        vertexIndices.push(faceIndices[0], faceIndices[k], faceIndices[k + 1]);
      }
    }
  }

  const positions = new Float32Array(vertexIndices.length * 3);
  for (let i = 0; i < vertexIndices.length; i++) {
    const vIdx = vertexIndices[i];
    const vert = vertices[vIdx] || [0, 0, 0];
    positions[i * 3] = vert[0];
    positions[i * 3 + 1] = vert[1];
    positions[i * 3 + 2] = vert[2];
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  geometry.center();

  // Normalize scale to fit roughly in a 4-unit box
  geometry.computeBoundingBox();
  if (geometry.boundingBox) {
    const size = new THREE.Vector3();
    geometry.boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 5.0 / maxDim;
      geometry.scale(scale, scale, scale);
    }
  }

  return geometry;
}
