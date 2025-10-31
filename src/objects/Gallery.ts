import * as THREE from 'three';

export class Gallery {
  private scene: THREE.Scene;
  public floor: THREE.Mesh;
  public ceiling: THREE.Mesh;
  public walls: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createFloor();
    this.createCeiling();
    this.createWalls();
  }

  private createFloor(): void {
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.2,
      metalness: 0.8
    });
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x333333);
    this.scene.add(gridHelper);
  }

  private createCeiling(): void {
    const ceilingGeometry = new THREE.PlaneGeometry(20, 20);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
      side: THREE.DoubleSide
    });
    this.ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    this.ceiling.rotation.x = Math.PI / 2;
    this.ceiling.position.y = 6;
    this.ceiling.receiveShadow = true;
    this.scene.add(this.ceiling);
  }

  private createWalls(): void {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 0.8,
      metalness: 0.1
    });

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 6),
      wallMaterial
    );
    backWall.position.set(0, 3, -10);
    backWall.receiveShadow = true;
    this.walls.push(backWall);
    this.scene.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 6),
      wallMaterial
    );
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-10, 3, 0);
    leftWall.receiveShadow = true;
    this.walls.push(leftWall);
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 6),
      wallMaterial
    );
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(10, 3, 0);
    rightWall.receiveShadow = true;
    this.walls.push(rightWall);
    this.scene.add(rightWall);
  }
}
