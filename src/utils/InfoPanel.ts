export class InfoPanel {
  constructor() {
    this.createInfoPanel();
  }

  private createInfoPanel(): void {
    const infoPanelHTML = `
      <div id="info-panel" style="
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(10px);
        color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        max-width: 300px;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      ">
        <h2 style="margin: 0 0 15px 0; font-size: 1.2rem; font-weight: 600;">
          3D Virtual Art Gallery
        </h2>
        <div style="margin-bottom: 15px;">
          <strong style="color: #4a90e2;">Controls:</strong>
          <ul style="margin: 5px 0; padding-left: 20px;">
            <li>Left Click + Drag: Rotate view</li>
            <li>Right Click + Drag: Pan</li>
            <li>Scroll: Zoom in/out</li>
            <li>Touch: Pinch to zoom</li>
          </ul>
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: #4a90e2;">Features:</strong>
          <ul style="margin: 5px 0; padding-left: 20px;">
            <li>5+ 3D art objects</li>
            <li>Dynamic lighting system</li>
            <li>Real-time shadows</li>
            <li>Particle effects</li>
            <li>Post-processing bloom</li>
          </ul>
        </div>
        <button id="toggle-info" style="
          background: #4a90e2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
          margin-top: 10px;
          width: 100%;
        ">
          Hide Info
        </button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', infoPanelHTML);

    const toggleButton = document.getElementById('toggle-info')!;
    const panel = document.getElementById('info-panel')!;
    let isVisible = true;

    toggleButton.addEventListener('click', () => {
      isVisible = !isVisible;
      if (isVisible) {
        panel.style.display = 'block';
        toggleButton.textContent = 'Hide Info';
      } else {
        const content = panel.children[0] as HTMLElement;
        Array.from(panel.children).forEach((child, index) => {
          if (index !== panel.children.length - 1) {
            (child as HTMLElement).style.display = 'none';
          }
        });
        panel.style.padding = '10px';
        toggleButton.textContent = 'Show Info';
      }
    });
  }
}
