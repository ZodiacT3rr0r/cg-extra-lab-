import * as THREE from 'three';
import { Actor } from './types';

export class ActorManager {
  private scene: THREE.Scene;
  public actors: Actor[] = [];
  private actorMeshes: Map<string, THREE.Group> = new Map();
  private nextId = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public createActor(type: 'humanoid' | 'robot' | 'alien' | 'creature' | 'statue', position: THREE.Vector3): Actor {
    const id = `actor-${this.nextId++}`;
    const actor: Actor = {
      id,
      type,
      position: position.clone(),
      rotation: new THREE.Euler(),
      scale: new THREE.Vector3(1, 1, 1),
      visible: true,
      animation: {
        type: 'idle',
        speed: 1,
        time: 0
      },
      interactions: []
    };

    this.actors.push(actor);
    this.createActorMesh(actor);
    return actor;
  }

  private createActorMesh(actor: Actor): void {
    const group = new THREE.Group();
    group.position.copy(actor.position);
    group.rotation.copy(actor.rotation);
    group.scale.copy(actor.scale);

    const mesh = this.createGeometryForType(actor.type);
    group.add(mesh);

    this.actorMeshes.set(actor.id, group);
    this.scene.add(group);
  }

  private createGeometryForType(type: string): THREE.Group {
    switch (type) {
      case 'humanoid':
        return this.createHumanoidActor();
      case 'robot':
        return this.createRobotActor();
      case 'alien':
        return this.createAlienActor();
      case 'creature':
        return this.createCreatureActor();
      case 'statue':
        return this.createStatueActor();
      default:
        const geometry = new THREE.BoxGeometry(0.6, 1.8, 0.4);
        const material = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });
        const mesh = new THREE.Mesh(geometry, material);
        const group = new THREE.Group();
        group.add(mesh);
        return group;
    }
  }

  private createHumanoidActor(): THREE.Group {
    const group = new THREE.Group();

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      metalness: 0.1,
      roughness: 0.8
    });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.8, 8), bodyMaterial);
    body.position.y = 0.4;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), bodyMaterial);
    head.position.y = 1.2;
    head.castShadow = true;
    head.receiveShadow = true;
    group.add(head);

    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 6), bodyMaterial);
    leftArm.position.set(-0.32, 0.65, 0);
    leftArm.rotation.z = 0.3;
    leftArm.castShadow = true;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 6), bodyMaterial);
    rightArm.position.set(0.32, 0.65, 0);
    rightArm.rotation.z = -0.3;
    rightArm.castShadow = true;
    group.add(rightArm);

    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 6), bodyMaterial);
    leftLeg.position.set(-0.12, 0, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 6), bodyMaterial);
    rightLeg.position.set(0.12, 0, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    return group;
  }

  private createRobotActor(): THREE.Group {
    const group = new THREE.Group();

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.9,
      roughness: 0.2
    });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), metalMaterial);
    torso.position.y = 0.4;
    torso.castShadow = true;
    torso.receiveShadow = true;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 0.25), metalMaterial);
    head.position.y = 1.1;
    head.castShadow = true;
    group.add(head);

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.8
    });
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eyeMaterial);
    eye.position.set(0.08, 1.15, 0.13);
    group.add(eye);

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 0.1), metalMaterial);
    leftArm.position.set(-0.25, 0.6, 0);
    leftArm.castShadow = true;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 0.1), metalMaterial);
    rightArm.position.set(0.25, 0.6, 0);
    rightArm.castShadow = true;
    group.add(rightArm);

    return group;
  }

  private createAlienActor(): THREE.Group {
    const group = new THREE.Group();

    const alienMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      metalness: 0.3,
      roughness: 0.5,
      emissive: 0x00aa00,
      emissiveIntensity: 0.3
    });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), alienMaterial);
    head.position.y = 1.0;
    head.castShadow = true;
    group.add(head);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), alienMaterial);
    eye1.position.set(-0.1, 1.1, 0.2);
    group.add(eye1);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), alienMaterial);
    eye2.position.set(0.1, 1.1, 0.2);
    group.add(eye2);

    const body = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.7, 8), alienMaterial);
    body.position.y = 0.25;
    body.castShadow = true;
    group.add(body);

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const tentacle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.5, 6), alienMaterial);
      tentacle.position.set(
        Math.cos(angle) * 0.2,
        0.1,
        Math.sin(angle) * 0.2
      );
      tentacle.rotation.z = Math.random() * 0.3;
      tentacle.castShadow = true;
      group.add(tentacle);
    }

    return group;
  }

  private createCreatureActor(): THREE.Group {
    const group = new THREE.Group();

    const creatureMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF6B6B,
      metalness: 0.2,
      roughness: 0.7
    });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), creatureMaterial);
    head.position.y = 0.8;
    head.castShadow = true;
    group.add(head);

    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), creatureMaterial);
    snout.position.set(0, 0.7, 0.28);
    group.add(snout);

    const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), creatureMaterial);
    leftEar.position.set(-0.2, 1.15, 0);
    group.add(leftEar);

    const rightEar = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), creatureMaterial);
    rightEar.position.set(0.2, 1.15, 0);
    group.add(rightEar);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), creatureMaterial);
    body.scale.set(1, 0.7, 1.2);
    body.position.y = 0.1;
    body.castShadow = true;
    group.add(body);

    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 6), creatureMaterial);
      leg.position.set(
        (i % 2 === 0 ? -1 : 1) * 0.15,
        -0.1,
        (i < 2 ? -1 : 1) * 0.15
      );
      leg.castShadow = true;
      group.add(leg);
    }

    return group;
  }

  private createStatueActor(): THREE.Group {
    const group = new THREE.Group();

    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      metalness: 0,
      roughness: 0.9
    });

    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), stoneMaterial);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    group.add(pedestal);

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.8, 0.25), stoneMaterial);
    body.position.y = 0.65;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.3, 0.22), stoneMaterial);
    head.position.y = 1.3;
    head.castShadow = true;
    group.add(head);

    return group;
  }

  public updateActor(id: string, updates: Partial<Actor>): void {
    const actor = this.actors.find(a => a.id === id);
    const mesh = this.actorMeshes.get(id);

    if (!actor || !mesh) return;

    Object.assign(actor, updates);

    if (updates.position) {
      mesh.position.copy(actor.position);
    }
    if (updates.rotation) {
      mesh.rotation.copy(actor.rotation);
    }
    if (updates.scale) {
      mesh.scale.copy(actor.scale);
    }
    if (updates.visible !== undefined) {
      mesh.visible = actor.visible;
    }
  }

  public removeActor(id: string): void {
    const index = this.actors.findIndex(a => a.id === id);
    if (index > -1) {
      this.actors.splice(index, 1);
    }

    const mesh = this.actorMeshes.get(id);
    if (mesh) {
      this.scene.remove(mesh);
      this.actorMeshes.delete(id);
    }
  }

  public getActorAt(position: THREE.Vector3, radius: number = 1): Actor | null {
    for (const actor of this.actors) {
      const distance = actor.position.distanceTo(position);
      if (distance < radius) {
        return actor;
      }
    }
    return null;
  }

  public update(time: number): void {
    this.actors.forEach(actor => {
      if (actor.animation) {
        actor.animation.time += 0.016 * actor.animation.speed;

        const mesh = this.actorMeshes.get(actor.id);
        if (mesh) {
          switch (actor.animation.type) {
            case 'walk':
              // Update both mesh and actor position
              const moveSpeed = 0.05;
              const dx = Math.cos(actor.rotation.y) * moveSpeed;
              const dz = Math.sin(actor.rotation.y) * moveSpeed;
              mesh.position.x += dx;
              mesh.position.z += dz;
              actor.position.x += dx;
              actor.position.z += dz;
              // Add a slight bobbing motion while walking
              mesh.position.y = actor.position.y + Math.sin(time * 5) * 0.1;
              break;
            case 'idle':
              mesh.position.y = actor.position.y + Math.sin(time * 2) * 0.05;
              break;
            case 'spin':
              actor.rotation.y += 0.05;
              mesh.rotation.y = actor.rotation.y;
              break;
            case 'wave':
              const children = mesh.children;
              if (children.length > 3) {
                const arm = children[3];
                arm.rotation.z = Math.sin(time * 3) * 0.5;
              }
              break;
          }
        }
      }
    });
  }

  public getAllActors(): Actor[] {
    return this.actors;
  }

  public getActorById(id: string): Actor | undefined {
    return this.actors.find(a => a.id === id);
  }
}
