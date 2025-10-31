import './index.css';
import { SceneSetup } from './scene/SceneSetup';
import { Lighting } from './scene/Lighting';
import { Gallery } from './objects/Gallery';
import { ArtObjects } from './objects/ArtObjects';
import { ParticleSystem } from './effects/ParticleSystem';
import { PostProcessing } from './effects/PostProcessing';
import { LoadingManager } from './utils/LoadingManager';
import { InfoPanel } from './utils/InfoPanel';

class VirtualGallery {
  private sceneSetup: SceneSetup;
  private lighting: Lighting;
  private gallery: Gallery;
  private artObjects: ArtObjects;
  private particleSystem: ParticleSystem;
  private postProcessing: PostProcessing;
  private loadingManager: LoadingManager;
  private animationId: number | null = null;
  private clock = { startTime: Date.now() };

  constructor() {
    this.loadingManager = new LoadingManager();
    this.init();
  }

  private async init(): Promise<void> {
    try {
      this.loadingManager.updateProgress(0.2);

      this.sceneSetup = new SceneSetup();
      document.body.appendChild(this.sceneSetup.getCanvas());

      this.loadingManager.updateProgress(0.4);

      this.lighting = new Lighting(this.sceneSetup.scene);
      this.loadingManager.updateProgress(0.5);

      this.gallery = new Gallery(this.sceneSetup.scene);
      this.loadingManager.updateProgress(0.7);

      this.artObjects = new ArtObjects(this.sceneSetup.scene);
      this.loadingManager.updateProgress(0.8);

      this.particleSystem = new ParticleSystem(this.sceneSetup.scene);
      this.loadingManager.updateProgress(0.9);

      this.postProcessing = new PostProcessing(
        this.sceneSetup.renderer,
        this.sceneSetup.scene,
        this.sceneSetup.camera
      );

      this.loadingManager.updateProgress(1.0);

      await new Promise(resolve => setTimeout(resolve, 500));

      this.loadingManager.complete();

      new InfoPanel();

      this.animate();

      console.log('Virtual Gallery initialized successfully');
    } catch (error) {
      console.error('Error initializing gallery:', error);
      this.loadingManager.showError('Failed to load gallery');
    }
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
