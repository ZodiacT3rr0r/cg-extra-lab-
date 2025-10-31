import * as THREE from 'three';

export class Lighting {
  private scene: THREE.Scene;
  public ambientLight: THREE.AmbientLight;
  public mainLight: THREE.DirectionalLight;
  public spotLight: THREE.SpotLight;
  public pointLights: THREE.PointLight[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.mainLight.position.set(5, 10, 5);
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;
    this.mainLight.shadow.camera.near = 0.5;
    this.mainLight.shadow.camera.far = 50;
    this.mainLight.shadow.camera.left = -15;
    this.mainLight.shadow.camera.right = 15;
    this.mainLight.shadow.camera.top = 15;
    this.mainLight.shadow.camera.bottom = -15;
    this.scene.add(this.mainLight);

    this.spotLight = new THREE.SpotLight(0xffffff, 2.0);
    this.spotLight.position.set(0, 8, 0);
    this.spotLight.angle = Math.PI / 6;
    this.spotLight.penumbra = 0.3;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.scene.add(this.spotLight);

    const artLightPositions = [
      { x: -6, y: 3, z: 0 },
      { x: 6, y: 3, z: 0 },
      { x: 0, y: 3, z: -7 }
    ];

    artLightPositions.forEach(pos => {
      const pointLight = new THREE.PointLight(0xffffee, 1.5, 10);
      pointLight.position.set(pos.x, pos.y, pos.z);
      pointLight.castShadow = true;
      pointLight.shadow.mapSize.width = 512;
      pointLight.shadow.mapSize.height = 512;
      this.pointLights.push(pointLight);
      this.scene.add(pointLight);
    });
  }

  public update(time: number): void {
    this.spotLight.intensity = 2.0 + Math.sin(time * 0.5) * 0.3;

    this.pointLights.forEach((light, index) => {
      light.intensity = 1.5 + Math.sin(time * 0.8 + index * Math.PI / 3) * 0.2;
    });
  }
}
