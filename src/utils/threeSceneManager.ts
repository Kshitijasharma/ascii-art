/**
 * Three.js 3D Scene Controller
 * Renders meshes to an offscreen luminance buffer for the dither engine
 */

import * as THREE from 'three';
import { MeshModelType, RenderSettings } from '../types';
import { getModelGeometry } from './proceduralModels';

export class ThreeSceneManager {
  private width: number;
  private height: number;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private currentMesh: THREE.Mesh | null = null;
  private meshGroup: THREE.Group;
  private keyLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private rimLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;

  // Offscreen sampling canvas for reading pixels
  private sampleCanvas: HTMLCanvasElement;
  private sampleCtx: CanvasRenderingContext2D;

  // Interaction rotation state
  public isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  public rotationX = 0.15;
  public rotationY = 0.25;
  public targetRotationX = 0.15;
  public targetRotationY = 0.25;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff); // pure white background

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 8.5);

    // Hidden WebGL canvas for rendering 3D buffer
    const webglCanvas = document.createElement('canvas');
    webglCanvas.width = width;
    webglCanvas.height = height;

    this.renderer = new THREE.WebGLRenderer({
      canvas: webglCanvas,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Offscreen 2D sampling canvas
    this.sampleCanvas = document.createElement('canvas');
    this.sampleCanvas.width = width;
    this.sampleCanvas.height = height;
    const ctx = this.sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get 2d context for sample canvas');
    this.sampleCtx = ctx;

    // Lighting setup
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(this.ambientLight);

    // Directional Key Light
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    this.keyLight.position.set(5, 6, 6);
    this.scene.add(this.keyLight);

    // Fill Light
    this.fillLight = new THREE.DirectionalLight(0xaaccff, 0.8);
    this.fillLight.position.set(-5, -2, 4);
    this.scene.add(this.fillLight);

    // Rim / Back Light for sharp silhouette definition
    this.rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    this.rimLight.position.set(0, 6, -6);
    this.scene.add(this.rimLight);

    this.meshGroup = new THREE.Group();
    this.scene.add(this.meshGroup);

    this.setModel('classical-torso');
  }

  public setSize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.sampleCanvas.width = width;
    this.sampleCanvas.height = height;
  }

  public setModel(type: MeshModelType, customGeometry?: THREE.BufferGeometry): void {
    if (this.currentMesh) {
      this.meshGroup.remove(this.currentMesh);
      if (this.currentMesh.geometry) {
        this.currentMesh.geometry.dispose();
      }
      this.currentMesh = null;
    }

    const geometry = customGeometry || getModelGeometry(type);
    geometry.center();

    // Physically-based material with high shadow definition
    const material = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.35,
      metalness: 0.05,
      flatShading: false,
    });

    this.currentMesh = new THREE.Mesh(geometry, material);
    this.meshGroup.add(this.currentMesh);
  }

  public update(settings: RenderSettings, deltaTime: number): void {
    // Smooth camera / mesh rotation damping
    if (settings.autoRotate && !this.isDragging) {
      this.targetRotationY += deltaTime * settings.rotationSpeed * 0.8;
    }

    // Interpolate smoothly toward target angles
    this.rotationX += (this.targetRotationX - this.rotationX) * 0.12;
    this.rotationY += (this.targetRotationY - this.rotationY) * 0.12;

    this.meshGroup.rotation.x = this.rotationX;
    this.meshGroup.rotation.y = this.rotationY;

    // Update dynamic light angles
    const lightRadX = (settings.lightAngleX * Math.PI) / 180;
    const lightRadY = (settings.lightAngleY * Math.PI) / 180;
    const lightDist = 8;
    this.keyLight.position.set(
      Math.sin(lightRadX) * Math.cos(lightRadY) * lightDist,
      Math.sin(lightRadY) * lightDist,
      Math.cos(lightRadX) * Math.cos(lightRadY) * lightDist
    );
    this.keyLight.intensity = settings.lightIntensity;

    // Adjust camera distance for zoom
    this.camera.position.z = 8.5 / Math.max(0.2, settings.zoom);
  }

  public renderAndGetImageData(): ImageData {
    this.renderer.render(this.scene, this.camera);
    // Draw the WebGL canvas onto the 2D sample canvas to extract ImageData efficiently
    this.sampleCtx.drawImage(this.renderer.domElement, 0, 0);
    return this.sampleCtx.getImageData(0, 0, this.width, this.height);
  }

  public handlePointerDown(x: number, y: number): void {
    this.isDragging = true;
    this.previousMousePosition = { x, y };
  }

  public handlePointerMove(x: number, y: number): void {
    if (!this.isDragging) return;
    const deltaX = x - this.previousMousePosition.x;
    const deltaY = y - this.previousMousePosition.y;

    this.targetRotationY += deltaX * 0.008;
    this.targetRotationX = Math.max(
      -Math.PI / 2.2,
      Math.min(Math.PI / 2.2, this.targetRotationX + deltaY * 0.008)
    );

    this.previousMousePosition = { x, y };
  }

  public handlePointerUp(): void {
    this.isDragging = false;
  }

  public dispose(): void {
    this.renderer.dispose();
  }
}
