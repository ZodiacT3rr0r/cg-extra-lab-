import { ActorManager } from '../actors/ActorManager';
import * as THREE from 'three';

export class ActorUI {
  private actorManager: ActorManager;
  private container: HTMLElement;
  private selectedActorId: string | null = null;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(actorManager: ActorManager) {
    this.actorManager = actorManager;
    this.container = this.createUIPanel();
    document.body.appendChild(this.container);
    this.setupEventListeners();
  }

  private createUIPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.id = 'actor-ui-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 10px;
      padding: 20px;
      width: 300px;
      max-height: 500px;
      overflow-y: auto;
      border: 1px solid rgba(74, 144, 226, 0.3);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #ffffff;
      font-size: 14px;
      z-index: 900;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Actor Manager';
    title.style.cssText = `
      margin: 0 0 15px 0;
      font-size: 1.1rem;
      color: #4a90e2;
      font-weight: 600;
    `;
    panel.appendChild(title);

    const createSection = this.createActorCreationSection();
    panel.appendChild(createSection);

    const listSection = this.createActorListSection();
    panel.appendChild(listSection);

    const animationSection = this.createAnimationControlSection();
    panel.appendChild(animationSection);

    const rotationSection = this.createRotationControlSection();
    panel.appendChild(rotationSection);

    return panel;
  }

  private createActorCreationSection(): HTMLElement {
    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 20px;';

    const heading = document.createElement('h4');
    heading.textContent = 'Spawn Actor';
    heading.style.cssText = 'color: #88ccff; font-size: 0.9rem; margin-bottom: 10px;';
    section.appendChild(heading);

    const typeSelect = document.createElement('select');
    typeSelect.style.cssText = `
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid #4a90e2;
      border-radius: 5px;
      color: #ffffff;
      font-size: 12px;
    `;

    const types = [
      { value: 'humanoid', label: '👤 Humanoid' },
      { value: 'robot', label: '🤖 Robot' },
      { value: 'alien', label: '👽 Alien' },
      { value: 'creature', label: '🐉 Creature' },
      { value: 'statue', label: '🗿 Statue' }
    ];

    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type.value;
      option.textContent = type.label;
      typeSelect.appendChild(option);
    });

    section.appendChild(typeSelect);

    const positionLabel = document.createElement('label');
    positionLabel.textContent = 'Random Position:';
    positionLabel.style.cssText = 'display: block; margin-bottom: 8px; font-size: 12px; color: #aaa;';
    section.appendChild(positionLabel);

    const spawnButton = document.createElement('button');
    spawnButton.textContent = 'Spawn Actor';
    spawnButton.style.cssText = `
      width: 100%;
      padding: 10px;
      background: #4a90e2;
      border: none;
      border-radius: 5px;
      color: white;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: background 0.2s;
    `;
    spawnButton.onmouseover = () => { spawnButton.style.background = '#357abd'; };
    spawnButton.onmouseout = () => { spawnButton.style.background = '#4a90e2'; };
    spawnButton.onclick = () => {
      const type = typeSelect.value;
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        0.5,
        (Math.random() - 0.5) * 14
      );
      this.actorManager.createActor(type as 'humanoid' | 'robot' | 'alien' | 'creature' | 'statue', pos);
      this.updateActorList();
    };
    section.appendChild(spawnButton);

    return section;
  }

  private createActorListSection(): HTMLElement {
    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 20px;';

    const heading = document.createElement('h4');
    heading.textContent = 'Actors';
    heading.style.cssText = 'color: #88ccff; font-size: 0.9rem; margin-bottom: 10px;';
    section.appendChild(heading);

    const listContainer = document.createElement('div');
    listContainer.id = 'actor-list';
    listContainer.style.cssText = 'max-height: 150px; overflow-y: auto;';
    section.appendChild(listContainer);

    return section;
  }

  private createAnimationControlSection(): HTMLElement {
    const section = document.createElement('div');
    section.id = 'animation-controls';
    section.style.cssText = 'margin-top: 20px;';

    const heading = document.createElement('h4');
    heading.textContent = 'Selected Actor Animation';
    heading.style.cssText = 'color: #88ccff; font-size: 0.9rem; margin-bottom: 10px;';
    section.appendChild(heading);

    const animSelect = document.createElement('select');
    animSelect.style.cssText = `
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid #4a90e2;
      border-radius: 5px;
      color: #ffffff;
      font-size: 12px;
    `;

    const animations = [
      { value: 'idle', label: 'Idle (Floating)' },
      { value: 'walk', label: 'Walk' },
      { value: 'spin', label: 'Spin' },
      { value: 'wave', label: 'Wave' }
    ];

    animations.forEach(anim => {
      const option = document.createElement('option');
      option.value = anim.value;
      option.textContent = anim.label;
      animSelect.appendChild(option);
    });

    animSelect.disabled = true;
    animSelect.style.opacity = '0.5';

    animSelect.onchange = () => {
      if (this.selectedActorId) {
        const actor = this.actorManager.getActorById(this.selectedActorId);
        if (actor) {
          actor.animation.type = animSelect.value as any;
        }
      }
    };

    section.appendChild(animSelect);

    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'Speed:';
    speedLabel.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px; color: #aaa;';
    section.appendChild(speedLabel);

    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '0.5';
    speedSlider.max = '3';
    speedSlider.step = '0.5';
    speedSlider.value = '1';
    speedSlider.style.cssText = 'width: 100%; cursor: pointer;';
    speedSlider.disabled = true;

    speedSlider.onchange = () => {
      if (this.selectedActorId) {
        const actor = this.actorManager.getActorById(this.selectedActorId);
        if (actor) {
          actor.animation.speed = parseFloat(speedSlider.value);
        }
      }
    };

    section.appendChild(speedSlider);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Selected';
    deleteButton.style.cssText = `
      width: 100%;
      padding: 8px;
      margin-top: 10px;
      background: #FF6B6B;
      border: none;
      border-radius: 5px;
      color: white;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s;
    `;
    deleteButton.disabled = true;
    deleteButton.style.opacity = '0.5';

    deleteButton.onclick = () => {
      if (this.selectedActorId) {
        this.actorManager.removeActor(this.selectedActorId);
        this.selectedActorId = null;
        this.updateActorList();
        this.updateAnimationControls();
      }
    };

    section.appendChild(deleteButton);

    section.dataset.animSelect = animSelect.id;
    section.dataset.speedSlider = speedSlider.id;
    section.dataset.deleteButton = deleteButton.id;

    return section;
  }

  private updateActorList(): void {
    const listContainer = document.getElementById('actor-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const actors = this.actorManager.getAllActors();

    if (actors.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'No actors spawned';
      empty.style.cssText = 'color: #666; font-size: 12px; margin: 0;';
      listContainer.appendChild(empty);
      return;
    }

    actors.forEach(actor => {
      const item = document.createElement('div');
      item.style.cssText = `
        padding: 8px;
        margin-bottom: 8px;
        background: ${this.selectedActorId === actor.id ? 'rgba(74, 144, 226, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
        border-radius: 5px;
        border: 1px solid ${this.selectedActorId === actor.id ? '#4a90e2' : 'rgba(74, 144, 226, 0.1)'};
        cursor: pointer;
        transition: all 0.2s;
      `;
      item.textContent = `${actor.type.toUpperCase()} ${actor.id.split('-')[1]}`;

      item.onmouseover = () => {
        item.style.background = 'rgba(74, 144, 226, 0.2)';
      };

      item.onmouseout = () => {
        if (this.selectedActorId !== actor.id) {
          item.style.background = 'rgba(255, 255, 255, 0.05)';
        }
      };

      item.onclick = () => {
        this.selectedActorId = actor.id;
        this.updateActorList();
        this.updateAnimationControls();
      };

      listContainer.appendChild(item);
    });
  }

  private updateAnimationControls(): void {
    const controlsSection = document.getElementById('animation-controls');
    if (!controlsSection) return;

    const animSelect = controlsSection.querySelector('select') as HTMLSelectElement;
    const speedSlider = controlsSection.querySelector('input[type="range"]') as HTMLInputElement;
    const deleteButton = controlsSection.querySelector('button') as HTMLButtonElement;

    if (!this.selectedActorId) {
      animSelect.disabled = true;
      speedSlider.disabled = true;
      deleteButton.disabled = true;
      animSelect.style.opacity = '0.5';
      speedSlider.style.opacity = '0.5';
      deleteButton.style.opacity = '0.5';
      return;
    }

    const actor = this.actorManager.getActorById(this.selectedActorId);
    if (actor) {
      animSelect.disabled = false;
      speedSlider.disabled = false;
      deleteButton.disabled = false;
      animSelect.style.opacity = '1';
      speedSlider.style.opacity = '1';
      deleteButton.style.opacity = '1';

      animSelect.value = actor.animation.type;
      speedSlider.value = actor.animation.speed.toString();
    }
  }

  private createRotationControlSection(): HTMLElement {
    const section = document.createElement('div');
    section.style.cssText = 'margin-top: 20px;';

    const heading = document.createElement('h4');
    heading.textContent = 'Rotation Control';
    heading.style.cssText = 'color: #88ccff; font-size: 0.9rem; margin-bottom: 10px;';
    section.appendChild(heading);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center;';

    const rotateLeft = document.createElement('button');
    rotateLeft.textContent = '⟲ Left';
    rotateLeft.style.cssText = this.getButtonStyle();
    rotateLeft.onclick = () => this.rotateSelectedActor(-Math.PI / 4);

    const rotateRight = document.createElement('button');
    rotateRight.textContent = '⟳ Right';
    rotateRight.style.cssText = this.getButtonStyle();
    rotateRight.onclick = () => this.rotateSelectedActor(Math.PI / 4);

    buttonContainer.appendChild(rotateLeft);
    buttonContainer.appendChild(rotateRight);
    section.appendChild(buttonContainer);

    return section;
  }

  private rotateSelectedActor(angle: number): void {
    if (this.selectedActorId) {
      const actor = this.actorManager.getActorById(this.selectedActorId);
      if (actor) {
        actor.rotation.y += angle;
      }
    }
  }

  private getButtonStyle(): string {
    return `
      padding: 8px 12px;
      background: rgba(74, 144, 226, 0.2);
      border: 1px solid #4a90e2;
      border-radius: 5px;
      color: #ffffff;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.3s;
      &:hover {
        background: rgba(74, 144, 226, 0.4);
      }
    `;
  }

  private setupEventListeners(): void {
    document.addEventListener('click', (event) => this.handleClick(event));
  }

  private handleClick(_event: MouseEvent): void {
    // Underscore prefix indicates intentionally unused parameter
  }

  public update(): void {
    this.updateActorList();
  }

  public getRaycaster(): THREE.Raycaster {
    return this.raycaster;
  }

  public getMouse(): THREE.Vector2 {
    return this.mouse;
  }
}
