import * as THREE from 'three';

export class ParticleSystem {
  private scene: THREE.Scene;
  private particles: THREE.Points;
  private particleCount = 200;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createParticles();
  }

  private createParticles(): void {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.7, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  public update(time: number): void {
    const positions = this.particles.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.005;

      if (positions[i3 + 1] > 6) {
        positions[i3 + 1] = 0;
      }
      if (positions[i3 + 1] < 0) {
        positions[i3 + 1] = 6;
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.rotation.y = time * 0.05;
  }
}
