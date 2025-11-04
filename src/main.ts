import './index.css';
import { SceneSetup } from './scene/SceneSetup';
import { Lighting } from './scene/Lighting';
import { Gallery } from './objects/Gallery';
import { ArtObjects } from './objects/ArtObjects';
import { ParticleSystem } from './effects/ParticleSystem';
import { PostProcessing } from './effects/PostProcessing';
import { EnvironmentEffects } from './effects/EnvironmentEffects';
import { LoadingManager } from './utils/LoadingManager';
import { InfoPanel } from './utils/InfoPanel';
import { EnvironmentOrganization } from './utils/EnvironmentOrganization';
import { ActorManager } from './actors/ActorManager';
import { ActorUI } from './utils/ActorUI';
import * as THREE from 'three';

class VirtualGallery {
  private sceneSetup!: SceneSetup;
  private lighting!: Lighting;
  // @ts-ignore - used for scene setup
  private gallery!: Gallery;
  private artObjects!: ArtObjects;
  private particleSystem!: ParticleSystem;
  private postProcessing!: PostProcessing;
  private environmentEffects!: EnvironmentEffects;
  private environmentOrganization!: EnvironmentOrganization;
  private actorManager!: ActorManager;
  // @ts-ignore - used for UI interactions
  private actorUI!: ActorUI;
  private loadingManager: LoadingManager;
  private animationId: number | null = null;
  private clock = { startTime: Date.now() };

  constructor() {
    this.loadingManager = new LoadingManager();
    this.init();
  }

  private async init(): Promise<void> {
    try {
      this.loadingManager.updateProgress(0.1);

      this.sceneSetup = new SceneSetup();
      document.body.appendChild(this.sceneSetup.getCanvas());

      this.loadingManager.updateProgress(0.2);

      this.lighting = new Lighting(this.sceneSetup.scene);
      this.loadingManager.updateProgress(0.3);

      this.gallery = new Gallery(this.sceneSetup.scene);
      this.loadingManager.updateProgress(0.4);

      this.artObjects = new ArtObjects(this.sceneSetup.scene);
      this.loadingManager.updateProgress(0.5);

      this.particleSystem = new ParticleSystem(this.sceneSetup.scene);
      this.loadingManager.updateProgress(0.6);

      this.environmentEffects = new EnvironmentEffects(this.sceneSetup.scene);
      console.log('Environment effects initialized');
      this.loadingManager.updateProgress(0.7);

      this.environmentOrganization = new EnvironmentOrganization(this.sceneSetup.scene);
      this.loadingManager.updateProgress(0.8);

      this.actorManager = new ActorManager(this.sceneSetup.scene);
      this.loadingManager.updateProgress(0.85);

      this.postProcessing = new PostProcessing(
        this.sceneSetup.renderer,
        this.sceneSetup.scene,
        this.sceneSetup.camera
      );

      this.loadingManager.updateProgress(0.9);

      this.actorUI = new ActorUI(this.actorManager);
      this.loadingManager.updateProgress(0.95);

      await new Promise(resolve => setTimeout(resolve, 500));

      this.loadingManager.complete();

      new InfoPanel();
      this.createInitialActors();

      this.animate();

      console.log('Virtual Gallery initialized successfully');
    } catch (error) {
      console.error('Error initializing gallery:', error);
      this.loadingManager.showError('Failed to load gallery');
    }
  }

  private createInitialActors(): void {
    const initialActors: Array<{
      type: 'humanoid' | 'robot' | 'alien' | 'creature' | 'statue';
      position: THREE.Vector3;
    }> = [
      { type: 'humanoid', position: new THREE.Vector3(-4, 0.5, -4) },
      { type: 'robot', position: new THREE.Vector3(4, 0.5, -4) },
      { type: 'alien', position: new THREE.Vector3(-4, 0.5, 4) },
      { type: 'creature', position: new THREE.Vector3(4, 0.5, 4) }
    ];

    initialActors.forEach(actor => {
      const createdActor = this.actorManager.createActor(actor.type, actor.position);
      createdActor.animation.type = ['idle', 'spin', 'wave', 'walk'][Math.floor(Math.random() * 4)] as any;
    });
  }

  private getElapsedTime(): number {
    return (Date.now() - this.clock.startTime) / 1000;
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    const time = this.getElapsedTime();

    this.sceneSetup.update();
    this.lighting.update(time);
    this.artObjects.update(time);
    this.particleSystem.update(time);
    this.environmentEffects.update(time);
    this.environmentOrganization.update(time);
    this.actorManager.update(time);

    this.postProcessing.render();
  };

  public dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

const app = new VirtualGallery();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    app.dispose();
  });
}
