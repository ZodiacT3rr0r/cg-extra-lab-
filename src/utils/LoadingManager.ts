export class LoadingManager {
  private loadingElement: HTMLElement;
  private progressBar: HTMLElement;
  private progressText: HTMLElement;
  private loadingComplete = false;

  constructor() {
    this.createLoadingScreen();
    this.loadingElement = document.getElementById('loading-screen')!;
    this.progressBar = document.getElementById('progress-bar')!;
    this.progressText = document.getElementById('progress-text')!;
  }

  private createLoadingScreen(): void {
    const loadingHTML = `
      <div id="loading-screen" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #ffffff;
      ">
        <div style="text-align: center;">
          <h1 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: 300; letter-spacing: 2px;">
            3D VIRTUAL GALLERY
          </h1>
          <div style="width: 300px; height: 4px; background: #333; border-radius: 2px; overflow: hidden; margin: 2rem auto;">
            <div id="progress-bar" style="
              width: 0%;
              height: 100%;
              background: linear-gradient(90deg, #4a90e2, #88ccff);
              transition: width 0.3s ease;
            "></div>
          </div>
          <p id="progress-text" style="font-size: 1rem; color: #888; margin-top: 1rem;">
            Loading... 0%
          </p>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
  }

  public updateProgress(progress: number): void {
    const percentage = Math.round(progress * 100);
    this.progressBar.style.width = `${percentage}%`;
    this.progressText.textContent = `Loading... ${percentage}%`;
  }

  public complete(): void {
    if (this.loadingComplete) return;
    this.loadingComplete = true;

    this.updateProgress(1);
    this.progressText.textContent = 'Ready!';

    setTimeout(() => {
      this.loadingElement.style.opacity = '0';
      this.loadingElement.style.transition = 'opacity 0.5s ease';

      setTimeout(() => {
        this.loadingElement.remove();
      }, 500);
    }, 500);
  }

  public showError(message: string): void {
    this.progressText.textContent = `Error: ${message}`;
    this.progressText.style.color = '#ff6b6b';
  }
}
