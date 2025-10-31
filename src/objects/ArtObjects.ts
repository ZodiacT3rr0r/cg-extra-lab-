import * as THREE from 'three';

export class ArtObjects {
  private scene: THREE.Scene;
  public animatedObjects: THREE.Mesh[] = [];
  public allObjects: THREE.Object3D[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createCentralSculpture();
    this.createGeometricArt();
    this.createAbstractInstallation();
    this.createCrystalFormation();
    this.createMetallicTorus();
    this.createPedestals();
  }

  private createCentralSculpture(): void {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x1a3a5a,
      emissiveIntensity: 0.3
    });
    const sculpture = new THREE.Mesh(geometry, material);
    sculpture.position.set(0, 2, 0);
    sculpture.castShadow = true;
    sculpture.receiveShadow = true;
    this.animatedObjects.push(sculpture);
    this.allObjects.push(sculpture);
    this.scene.add(sculpture);
  }

  private createGeometricArt(): void {
    const group = new THREE.Group();

    const shapes = [
      { geometry: new THREE.BoxGeometry(0.5, 0.5, 0.5), offset: -0.8 },
      { geometry: new THREE.SphereGeometry(0.3, 32, 32), offset: 0 },
      { geometry: new THREE.TetrahedronGeometry(0.4, 0), offset: 0.8 }
    ];

    shapes.forEach(({ geometry, offset }) => {
      const material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        metalness: 0.6,
        roughness: 0.3
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = offset;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    });

    group.position.set(-6, 2, 0);
    this.animatedObjects.push(group as any);
    this.allObjects.push(group);
    this.scene.add(group);
  }

  private createAbstractInstallation(): void {
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      metalness: 0.3,
      roughness: 0.7
    });

    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.TorusGeometry(0.8 - i * 0.2, 0.1, 16, 100);
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2 + i * 0.3;
      ring.rotation.y = i * 0.4;
      ring.castShadow = true;
      ring.receiveShadow = true;
      rings.push(ring);
    }

    const group = new THREE.Group();
    rings.forEach(ring => group.add(ring));
    group.position.set(6, 2, 0);
    this.animatedObjects.push(group as any);
    this.allObjects.push(group);
    this.scene.add(group);
  }

  private createCrystalFormation(): void {
    const group = new THREE.Group();
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < 5; i++) {
      const height = 0.5 + Math.random() * 0.8;
      const geometry = new THREE.ConeGeometry(0.2, height, 6);
      const crystal = new THREE.Mesh(geometry, material);

      const angle = (i / 5) * Math.PI * 2;
      crystal.position.set(
        Math.cos(angle) * 0.4,
        height / 2,
        Math.sin(angle) * 0.4
      );
      crystal.castShadow = true;
      crystal.receiveShadow = true;
      group.add(crystal);
    }

    group.position.set(0, 0.5, -6);
    this.allObjects.push(group);
    this.scene.add(group);
  }

  private createMetallicTorus(): void {
    const geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 1.0,
      roughness: 0.2,
      emissive: 0x332200,
      emissiveIntensity: 0.2
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.position.set(-4, 2, -6);
    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;
    this.animatedObjects.push(torusKnot);
    this.allObjects.push(torusKnot);
    this.scene.add(torusKnot);
  }

  private createPedestals(): void {
    const pedestalMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3a,
      metalness: 0.5,
      roughness: 0.5
    });

    const positions = [
      { x: 0, z: 0 },
      { x: -6, z: 0 },
      { x: 6, z: 0 },
      { x: 0, z: -6 },
      { x: -4, z: -6 }
    ];

    positions.forEach(pos => {
      const geometry = new THREE.CylinderGeometry(0.8, 0.9, 1, 8);
      const pedestal = new THREE.Mesh(geometry, pedestalMaterial);
      pedestal.position.set(pos.x, 0.5, pos.z);
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      this.allObjects.push(pedestal);
      this.scene.add(pedestal);
    });
  }

  public update(time: number): void {
    this.animatedObjects.forEach((obj, index) => {
      if (index === 0) {
        obj.rotation.y = time * 0.5;
        obj.rotation.x = Math.sin(time * 0.3) * 0.2;
      } else if (index === 1) {
        obj.rotation.y = time * 0.3;
        obj.children.forEach((child, i) => {
          child.rotation.z = time * (0.5 + i * 0.1);
        });
      } else if (index === 2) {
        obj.rotation.z = time * 0.4;
        obj.children.forEach((child, i) => {
          child.rotation.x += 0.01 * (i + 1);
        });
      } else if (index === 3) {
        obj.rotation.x = time * 0.3;
        obj.rotation.y = time * 0.2;
      }
    });
  }
}
