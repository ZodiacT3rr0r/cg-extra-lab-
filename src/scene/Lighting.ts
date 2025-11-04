import * as THREE from 'three';

export class Lighting {
  private scene: THREE.Scene;
  public ambientLight: THREE.AmbientLight;
  public mainLight: THREE.DirectionalLight;
  public spotLight: THREE.SpotLight;
  public pointLights: THREE.PointLight[] = [];
  private wallLights: THREE.PointLight[] = [];
  private ceilingLights: THREE.PointLight[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.mainLight.position.set(8, 12, 8);
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;
    this.mainLight.shadow.camera.near = 0.5;
    this.mainLight.shadow.camera.far = 50;
    this.mainLight.shadow.camera.left = -20;
    this.mainLight.shadow.camera.right = 20;
    this.mainLight.shadow.camera.top = 20;
    this.mainLight.shadow.camera.bottom = -20;
    this.scene.add(this.mainLight);

    this.spotLight = new THREE.SpotLight(0xffffff, 2.5);
    this.spotLight.position.set(0, 8, 0);
    this.spotLight.angle = Math.PI / 5;
    this.spotLight.penumbra = 0.3;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.scene.add(this.spotLight);

    const artLightPositions = [
      { x: -6, y: 3, z: 0 },
      { x: 6, y: 3, z: 0 },
      { x: 0, y: 3, z: -7 },
      { x: -4, y: 3, z: -6 },
      { x: 4, y: 3, z: 4 }
    ];

    artLightPositions.forEach(pos => {
      const pointLight = new THREE.PointLight(0xffffee, 2.0, 12);
      pointLight.position.set(pos.x, pos.y, pos.z);
      pointLight.castShadow = true;
      pointLight.shadow.mapSize.width = 512;
      pointLight.shadow.mapSize.height = 512;
      this.pointLights.push(pointLight);
      this.scene.add(pointLight);
    });

    this.createWallLights();
    this.createCeilingLights();
  }

  private createWallLights(): void {
    const wallLightPositions = [
      { x: -9, y: 3, z: -8, color: 0xff88ff },
      { x: 9, y: 3, z: -8, color: 0x88ffff },
      { x: -9, y: 3, z: 5, color: 0xffff88 },
      { x: 9, y: 3, z: 5, color: 0x88ff88 }
    ];

    wallLightPositions.forEach(pos => {
      const light = new THREE.PointLight(pos.color, 1.8, 12);
      light.position.set(pos.x, pos.y, pos.z);
      light.castShadow = false;
      this.wallLights.push(light);
      this.scene.add(light);
    });
  }

  private createCeilingLights(): void {
    const ceilingPositions = [
      { x: -8, z: -8 },
      { x: 8, z: -8 },
      { x: -8, z: 8 },
      { x: 8, z: 8 },
      { x: 0, z: 0 }
    ];

    ceilingPositions.forEach(pos => {
      const light = new THREE.PointLight(0xccccff, 1.2, 15);
      light.position.set(pos.x, 5.5, pos.z);
      light.castShadow = false;
      this.ceilingLights.push(light);
      this.scene.add(light);
    });
  }

  public update(time: number): void {
    this.spotLight.intensity = 2.5 + Math.sin(time * 0.5) * 0.3;

    this.pointLights.forEach((light, index) => {
      light.intensity = 2.0 + Math.sin(time * 0.8 + index * Math.PI / 3) * 0.3;
    });

    this.wallLights.forEach((light, index) => {
      light.intensity = 1.8 + Math.sin(time * 0.6 + index * Math.PI / 2) * 0.4;
    });

    this.ceilingLights.forEach((light, index) => {
      light.intensity = 1.2 + Math.sin(time * 0.4 + index * Math.PI / 5) * 0.2;
    });
  }
}
