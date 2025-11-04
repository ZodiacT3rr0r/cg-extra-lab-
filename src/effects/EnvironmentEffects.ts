import * as THREE from 'three';

export class EnvironmentEffects {
  private scene: THREE.Scene;
  private ambientParticles!: THREE.Points;
  private floatingObjects: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createAmbientParticles();
    this.createFloatingObjects();
  }

  private createAmbientParticles(): void {
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = Math.random() * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.5, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = Math.random() * 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.userData.velocities = velocities;

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.ambientParticles = new THREE.Points(geometry, material);
    this.scene.add(this.ambientParticles);
    this.scene.add(this.ambientParticles);
  }

  private createFloatingObjects(): void {
    const floatingPositions = [
      { position: new THREE.Vector3(-7, 2, -6), color: 0xff6b9d },
      { position: new THREE.Vector3(7, 2.5, 6), color: 0xc44569 },
      { position: new THREE.Vector3(-3, 3, 7), color: 0xf8b500 },
      { position: new THREE.Vector3(5, 2.2, -4), color: 0x00d4ff },
      { position: new THREE.Vector3(0, 3.5, -8), color: 0x845ef7 }
    ];

    floatingPositions.forEach(obj => {
      const geometry = new THREE.SphereGeometry(0.12, 16, 16);
      const material = new THREE.MeshStandardMaterial({
        color: obj.color,
        metalness: 0.6,
        roughness: 0.2,
        emissive: obj.color,
        emissiveIntensity: 0.3
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(obj.position);
      mesh.userData.originalY = obj.position.y;
      mesh.userData.floatSpeed = Math.random() * 0.5 + 0.5;
      this.floatingObjects.push(mesh);
      this.scene.add(mesh);
    });
  }

  public update(time: number): void {
    const positions = this.ambientParticles.geometry.attributes.position.array as Float32Array;
    const velocities = this.ambientParticles.geometry.userData.velocities as Float32Array;
    const particleCount = positions.length / 3;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      if (positions[i3] > 12.5) positions[i3] = -12.5;
      if (positions[i3] < -12.5) positions[i3] = 12.5;
      if (positions[i3 + 1] > 6) positions[i3 + 1] = 0;
      if (positions[i3 + 1] < 0) positions[i3 + 1] = 6;
      if (positions[i3 + 2] > 12.5) positions[i3 + 2] = -12.5;
      if (positions[i3 + 2] < -12.5) positions[i3 + 2] = 12.5;
    }

    this.ambientParticles.geometry.attributes.position.needsUpdate = true;
    this.ambientParticles.rotation.y = time * 0.02;

    this.floatingObjects.forEach((obj, index) => {
      obj.position.y = obj.userData.originalY + Math.sin(time * obj.userData.floatSpeed + index) * 0.3;
      obj.rotation.x += 0.005;
      obj.rotation.y += 0.008;
      obj.rotation.z += 0.003;
    });
  }

  public createDynamicLight(position: THREE.Vector3, color: number, intensity: number, duration: number): void {
    const light = new THREE.PointLight(color, intensity, 10);
    light.position.copy(position);
    this.scene.add(light);

    setTimeout(() => {
      this.scene.remove(light);
    }, duration * 1000);
  }

  public createExplosionEffect(position: THREE.Vector3, particleCount: number = 20): void {
    const particles: { mesh: THREE.Mesh; lifetime: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.05, 8, 8);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(Math.random(), 1, 0.6),
        emissive: new THREE.Color().setHSL(Math.random(), 1, 0.5),
        emissiveIntensity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);

      const angle = Math.random() * Math.PI * 2;
      const elevation = Math.random() * Math.PI;
      mesh.userData.velocity = new THREE.Vector3(
        Math.sin(elevation) * Math.cos(angle) * (0.1 + Math.random() * 0.1),
        Math.sin(elevation) * (0.1 + Math.random() * 0.1),
        Math.cos(elevation) * (0.1 + Math.random() * 0.1)
      );

      this.scene.add(mesh);
      particles.push({ mesh, lifetime: 1 });
    }

    const animateExplosion = () => {
      let activeParticles = false;

      particles.forEach(p => {
        p.lifetime -= 0.016;
        if (p.lifetime > 0) {
          p.mesh.position.add(p.mesh.userData.velocity);
          p.mesh.userData.velocity.y -= 0.005;
          if (p.mesh.material instanceof THREE.Material) {
            p.mesh.material.opacity = p.lifetime;
          }
          activeParticles = true;
        } else {
          this.scene.remove(p.mesh);
        }
      });

      if (activeParticles) {
        requestAnimationFrame(animateExplosion);
      }
    };

    animateExplosion();
  }
}
