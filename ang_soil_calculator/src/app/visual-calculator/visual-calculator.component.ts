import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { RGBELoader, TransformControls } from 'three-stdlib';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { EnvParams } from './env-params.model';

@Component({
  selector: 'app-visual-calculator',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './visual-calculator.component.html',
  styleUrl: './visual-calculator.component.css',
})
export class VisualCalculatorComponent implements AfterViewInit, OnInit {
  calculated_soil = 0;

  dimensionsForm = new FormGroup({
    x: new FormControl('x'),
    y: new FormControl('y'),
    z: new FormControl('z'),
  });

  submitDimensionChange() {
    console.log('Form submitted: ', this.dimensionsForm.value);
    this.changeBoxSize(
      Number(this.dimensionsForm.value.x),
      Number(this.dimensionsForm.value.y),
      Number(this.dimensionsForm.value.z)
    );

    this.calculate_soil(
      Number(this.dimensionsForm.value.x),
      Number(this.dimensionsForm.value.y),
      Number(this.dimensionsForm.value.z)
    );
  }

  calculate_soil(x: number, y: number, z: number) {
    const m3 = x * y * z;
    console.log('Calculating dimensions: ', x, y, z);
    console.log('Calculating soil: ', m3);
    this.calculated_soil = m3;
  }

  ngOnInit(): void {
    this.dimensionsForm.valueChanges.subscribe(() => {
      this.submitDimensionChange();
    });
  }

  @ViewChild('mycanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;
  private controls!: OrbitControls;

  envParams: EnvParams = {
    envMap: 'HDR',
    roughness: 0.0,
    metalness: 0.0,
    exposure: 1.0,
    debug: false,
  };

  ngAfterViewInit(): void {
    this.initThreejs();
    // Load environment map
    this.loadEnvMap();
    //this.setupLight();
    this.animate();
    //this.render(); // Only when not using animate
  }

  private initThreejs(): void {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = this.envParams.exposure;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 10, 0);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Enable smooth movement

    this.controls.minDistance = 5;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI / 2;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 'rgb(250, 0,0)',
      metalness: this.envParams.metalness,
      roughness: this.envParams.roughness,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 'rgb(140, 120, 110)',
    });

    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    //planeMesh.position.y = -5;
    planeMesh.rotation.x = -Math.PI * 0.5;
    this.scene.add(planeMesh);
  }

  private setupLight(): void {
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(light);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight1.position.set(10, 10, 10);
    this.scene.add(dirLight1);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    // Rotate the cube
    //this.cube.rotation.x += 0.001;
    //this.cube.rotation.y += 0.001;

    this.render();
  };

  private loadEnvMap(): void {
    if (this.scene) {
      const rgbeLoader = new RGBELoader()
        .setPath('assets/three/')
        .load('dry_orchard_meadow_1k.hdr', (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;

          // Set to env
          this.scene.environment = texture;
          this.scene.background = texture;
        });
    }
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private changeBoxSize(x: number, y: number, z: number) {
    this.cube.scale.set(x, y, z);
  }
}
