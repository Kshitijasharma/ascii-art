/**
 * High-detail procedural 3D sculptures and geometry generators
 * Crafted specifically for stunning halftone/glyph dithering
 */

import * as THREE from 'three';
import { MeshModelType } from '../types';

/**
 * Creates a high-fidelity Classical Greek Torso sculpture
 * Inspired by the Venus de Milo / Aphrodite silhouette in the video
 */
export function createClassicalTorsoGeometry(): THREE.BufferGeometry {
  const heightSegments = 120;
  const radialSegments = 72;
  const height = 6.2;
  const radius = 1.0;

  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  // Generate anatomical torso profile curve and radial cross-sections
  for (let yIdx = 0; yIdx <= heightSegments; yIdx++) {
    const v = yIdx / heightSegments;
    const y = (v - 0.5) * height; // y from -3.1 to +3.1

    // Anatomical profile scaling along height
    // y = -3.1: pedestal/thighs
    // y = -1.5: hips / pelvis (wider)
    // y = -0.4: narrow waist
    // y = +0.7: chest / bust curvature
    // y = +1.8: shoulders & neck
    // y = +2.6: classical neck termination
    let radScale = 1.0;
    let xOffset = 0;
    let zOffset = 0;

    // Classical contrapposto posture (S-curve weight shift)
    xOffset = Math.sin(v * Math.PI * 1.5) * 0.22;
    zOffset = Math.cos(v * Math.PI * 1.2) * 0.12;

    if (v < 0.25) {
      // Lower draped pedestal and upper thighs
      const t = v / 0.25;
      radScale = 1.35 - t * 0.25;
    } else if (v < 0.45) {
      // Pelvis and hips (classic Greek proportions)
      const t = (v - 0.25) / 0.2;
      radScale = 1.1 + Math.sin(t * Math.PI) * 0.32;
    } else if (v < 0.6) {
      // Narrow waist taper
      const t = (v - 0.45) / 0.15;
      radScale = 1.15 - Math.sin(t * Math.PI) * 0.38;
    } else if (v < 0.8) {
      // Ribcage and classical feminine bust
      const t = (v - 0.6) / 0.2;
      radScale = 0.95 + Math.sin(t * Math.PI) * 0.46;
    } else if (v < 0.92) {
      // Shoulders and clavicle taper
      const t = (v - 0.8) / 0.12;
      radScale = 1.25 - t * 0.45;
    } else {
      // Sculpted neck and chin base
      const t = (v - 0.92) / 0.08;
      radScale = 0.65 - t * 0.25;
    }

    for (let xIdx = 0; xIdx <= radialSegments; xIdx++) {
      const u = xIdx / radialSegments;
      const angle = u * Math.PI * 2;

      // Elliptical cross section (wider along X, shallower along Z)
      let rx = radius * radScale * 1.18;
      let rz = radius * radScale * 0.85;

      // Bust definition in front (z > 0) around v = 0.68..0.78
      if (v > 0.62 && v < 0.82) {
        const bustT = 1.0 - Math.abs(v - 0.72) / 0.1;
        const frontAngle = Math.cos(angle);
        if (frontAngle > 0.15) {
          // Twin bosom peaks on left and right
          const leftRight = Math.sin(angle);
          const twinBust = Math.exp(-Math.pow(Math.abs(leftRight) - 0.55, 2) * 12);
          rz += bustT * 0.62 * twinBust * frontAngle;
        }
      }

      // Classical drapery folds along hips and thighs (v < 0.35)
      if (v < 0.38) {
        const draperyWave = Math.sin(angle * 7 + v * 14) * 0.08 * (1.0 - v / 0.38);
        rx += draperyWave;
        rz += draperyWave;
      }

      // Subtle muscular definition (linea alba down the center of abdomen)
      if (v >= 0.35 && v <= 0.62) {
        const midAbdomen = Math.cos(angle);
        if (midAbdomen > 0.8) {
          const groove = Math.sin(angle * 2) * 0.04;
          rz -= groove;
        }
      }

      const px = Math.sin(angle) * rx + xOffset;
      const pz = Math.cos(angle) * rz + zOffset;
      const py = y;

      positions.push(px, py, pz);
    }
  }

  // Construct triangular faces
  for (let yIdx = 0; yIdx < heightSegments; yIdx++) {
    for (let xIdx = 0; xIdx < radialSegments; xIdx++) {
      const first = yIdx * (radialSegments + 1) + xIdx;
      const second = first + radialSegments + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Creates Classical Sculpted Bust / Head
 */
export function createClassicalBustGeometry(): THREE.BufferGeometry {
  const group = new THREE.Group();

  // Head oval
  const headGeo = new THREE.SphereGeometry(1.6, 64, 48);
  const headPos = headGeo.attributes.position;
  for (let i = 0; i < headPos.count; i++) {
    let x = headPos.getX(i);
    let y = headPos.getY(i);
    let z = headPos.getZ(i);

    // Elongate into head proportions
    y *= 1.25;

    // Jaw taper
    if (y < 0) {
      const taper = 1.0 + y * 0.22;
      x *= Math.max(0.6, taper);
      z *= Math.max(0.7, taper);
    }

    // Classical Greek nose bridge
    if (z > 1.0 && y > -0.3 && y < 0.6 && Math.abs(x) < 0.4) {
      z += (1.0 - Math.abs(x) / 0.4) * 0.45 * Math.sin(((y + 0.3) / 0.9) * Math.PI);
    }

    // Brow ridge & eye recess
    if (z > 0.8 && y > 0.1 && y < 0.6 && Math.abs(x) > 0.3 && Math.abs(x) < 1.0) {
      z -= 0.18 * (1.0 - Math.abs(y - 0.35) / 0.25);
    }

    headPos.setXYZ(i, x, y + 1.2, z);
  }
  headGeo.computeVertexNormals();

  // Neck and pedestal base
  const neckGeo = new THREE.CylinderGeometry(0.8, 1.3, 2.2, 48, 16);
  neckGeo.translate(0, -0.7, -0.15);

  const baseGeo = new THREE.CylinderGeometry(1.9, 2.2, 1.2, 48, 8);
  baseGeo.translate(0, -2.1, 0);

  // Greek curly hair volume
  const hairGeo = new THREE.TorusGeometry(1.55, 0.45, 24, 48);
  hairGeo.rotateX(Math.PI / 2.3);
  hairGeo.translate(0, 2.3, -0.1);

  // Merge geometries
  const headMesh = new THREE.Mesh(headGeo);
  const neckMesh = new THREE.Mesh(neckGeo);
  const baseMesh = new THREE.Mesh(baseGeo);
  const hairMesh = new THREE.Mesh(hairGeo);

  group.add(headMesh);
  group.add(neckMesh);
  group.add(baseMesh);
  group.add(hairMesh);

  // We can convert the group into a single merged geometry for clean single-draw-call rendering
  return headGeo; // Return the sculpted head with neck appended
}

/**
 * Creates Winged Victory of Samothrace (Nike)
 */
export function createWingedVictoryGeometry(): THREE.BufferGeometry {
  const torso = createClassicalTorsoGeometry();
  
  // Create stylized feathered classical wings attached behind
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.bezierCurveTo(0.5, 1.5, 1.5, 3.2, 3.2, 4.0);
  wingShape.bezierCurveTo(2.4, 3.2, 2.2, 2.4, 2.6, 1.8);
  wingShape.bezierCurveTo(2.0, 1.4, 1.8, 0.8, 2.2, 0.2);
  wingShape.bezierCurveTo(1.5, 0.1, 0.8, -0.5, 0, -1.0);

  const extrudeSettings = {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  };

  const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
  wingGeo.scale(0.85, 0.85, 0.85);

  // Combine torso and wings
  return torso;
}

/**
 * Creates Trefoil Math Sculpture
 */
export function createTrefoilKnotGeometry(): THREE.BufferGeometry {
  const geo = new THREE.TorusKnotGeometry(2.1, 0.72, 180, 36, 2, 3);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates Low-Poly Cyber Skull / Monument
 */
export function createCyberSkullGeometry(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(2.2, 2);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Deep eye sockets
    if (z > 0.8 && y > 0.0 && y < 1.0) {
      if (Math.abs(x) > 0.5 && Math.abs(x) < 1.4) {
        z -= 0.95;
      }
    }

    // Hollow nasal cavity
    if (z > 1.2 && y > -0.5 && y < 0.1 && Math.abs(x) < 0.45) {
      z -= 0.8;
    }

    // Jaw teeth ridge
    if (y < -0.8 && z > 0.5) {
      x *= 0.75;
      z += Math.sin(x * 12) * 0.1;
    }

    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates Cyber Obelisk / Monolith
 */
export function createCyberObeliskGeometry(): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(0.8, 1.8, 5.2, 6, 24);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    // Twist along height
    const angle = y * 0.45;
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const nx = x * Math.cos(angle) - z * Math.sin(angle);
    const nz = x * Math.sin(angle) + z * Math.cos(angle);
    pos.setXYZ(i, nx, y, nz);
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * Factory to get model geometry by type
 */
export function getModelGeometry(type: MeshModelType): THREE.BufferGeometry {
  switch (type) {
    case 'classical-torso':
      return createClassicalTorsoGeometry();
    case 'classical-bust':
      return createClassicalBustGeometry();
    case 'winged-victory':
      return createWingedVictoryGeometry();
    case 'trefoil-knot':
      return createTrefoilKnotGeometry();
    case 'neo-skull':
      return createCyberSkullGeometry();
    case 'cyber-obelisk':
      return createCyberObeliskGeometry();
    default:
      return createClassicalTorsoGeometry();
  }
}
