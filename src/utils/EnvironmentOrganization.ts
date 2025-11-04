import * as THREE from 'three';

export class EnvironmentOrganization {
  private scene: THREE.Scene;
  private signages: THREE.Group[] = [];
  private markers: THREE.Group[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createSignages();
    this.createNavigationMarkers();
  }

  private createSignages(): void {
    const signPositions = [
      { position: new THREE.Vector3(-8, 2.5, -9.5), text: 'SCULPTURES' },
      { position: new THREE.Vector3(8, 2.5, -9.5), text: 'INSTALLATIONS' },
      { position: new THREE.Vector3(-8, 2.5, 9), text: 'GALLERY' },
      { position: new THREE.Vector3(8, 2.5, 9), text: 'EXHIBITIONS' }
    ];

    signPositions.forEach(sign => {
      const signGroup = this.createSignage(sign.text);
      signGroup.position.copy(sign.position);
      this.signages.push(signGroup);
      this.scene.add(signGroup);
    });
  }

  private createSignage(text: string): THREE.Group {
    const group = new THREE.Group();

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.5,
      roughness: 0.5
    });

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.2), baseMaterial);
    base.position.y = 0.1;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    const signMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.3,
      roughness: 0.4
    });

    const signPlate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.05), signMaterial);
    signPlate.position.y = 0.5;
    signPlate.castShadow = true;
    group.add(signPlate);

    const textGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.02);
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5
    });

    for (let i = 0; i < text.length; i++) {
      const letterBox = new THREE.Mesh(textGeometry, textMaterial);
      letterBox.position.set(
        -0.6 + i * 0.18,
        0.5,
        0.05
      );
      group.add(letterBox);
    }

    return group;
  }

  private createNavigationMarkers(): void {
    const markerPositions = [
      { position: new THREE.Vector3(-5, 0.1, -5), color: 0xff0000 },
      { position: new THREE.Vector3(5, 0.1, -5), color: 0x00ff00 },
      { position: new THREE.Vector3(-5, 0.1, 5), color: 0x0000ff },
      { position: new THREE.Vector3(5, 0.1, 5), color: 0xffff00 },
      { position: new THREE.Vector3(0, 0.1, 0), color: 0xff00ff }
    ];

    markerPositions.forEach(marker => {
      const markerGroup = this.createMarker(marker.color);
      markerGroup.position.copy(marker.position);
      this.markers.push(markerGroup);
      this.scene.add(markerGroup);
    });
  }

  private createMarker(color: number): THREE.Group {
    const group = new THREE.Group();

    const markerMaterial = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.8,
      roughness: 0.2,
      emissive: color,
      emissiveIntensity: 0.4
    });

    const circle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16), markerMaterial);
    circle.rotation.x = -Math.PI / 2;
    circle.receiveShadow = true;
    group.add(circle);

    const centerDot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), markerMaterial);
    centerDot.position.y = 0.03;
    group.add(centerDot);

    return group;
  }

  public createZoneMarker(center: THREE.Vector3, radius: number, _name: string): THREE.Group {
    const group = new THREE.Group();

    const zoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      metalness: 0,
      roughness: 0.8,
      transparent: true,
      opacity: 0.2
    });

    const zone = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.05, 32), zoneMaterial);
    zone.position.copy(center);
    zone.position.y = 0.05;
    zone.receiveShadow = true;
    group.add(zone);

    const outline = new THREE.LineLoop(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0x4a90e2 })
    );

    const points = [];
    for (let i = 0; i <= 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          center.x + Math.cos(angle) * radius,
          center.y + 0.1,
          center.z + Math.sin(angle) * radius
        )
      );
    }
    outline.geometry.setFromPoints(points);
    group.add(outline);

    return group;
  }

  public createDisplayPlatform(position: THREE.Vector3, width: number = 1, depth: number = 1): THREE.Mesh {
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.7,
      roughness: 0.3
    });

    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.15, depth),
      platformMaterial
    );
    platform.position.copy(position);
    platform.position.y += 0.075;
    platform.castShadow = true;
    platform.receiveShadow = true;

    this.scene.add(platform);
    return platform;
  }

  public createInformationDisplay(position: THREE.Vector3, _text: string): THREE.Group {
    const group = new THREE.Group();
    group.position.copy(position);

    const displayMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.5,
      roughness: 0.5
    });

    const screen = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 0.05), displayMaterial);
    screen.castShadow = true;
    group.add(screen);

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2
    });

    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), frameMaterial);
    frameLeft.position.x = -0.525;
    group.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), frameMaterial);
    frameRight.position.x = 0.525;
    group.add(frameRight);

    const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.05), frameMaterial);
    frameBottom.position.y = -0.325;
    group.add(frameBottom);

    return group;
  }

  public update(time: number): void {
    this.signages.forEach((sign, index) => {
      sign.rotation.y = Math.sin(time * 0.5 + index * Math.PI / 2) * 0.1;
      
      // Safely handle children objects
      const thirdChild = sign.children[2];
      if (thirdChild && thirdChild.children) {
        thirdChild.children.forEach((child, i) => {
          if (child instanceof THREE.Mesh) {
            child.position.y = 0.5 + Math.sin(time * 2 + i * 0.2) * 0.05;
          }
        });
      }
    });

    this.markers.forEach((marker, index) => {
      marker.rotation.z = time * 1 + index * (Math.PI * 2 / 5);
      marker.position.y = 0.1 + Math.sin(time * 2 + index) * 0.05;
    });
  }
}
