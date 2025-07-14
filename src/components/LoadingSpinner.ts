import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('loading-spinner')
export class LoadingSpinner extends LitElement {
  @property({ type: String }) message = 'Loading...';
  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'medium';

  static styles = css`
    :host {
      display: inline-block;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      display: inline-block;
      border: 3px solid rgba(0, 255, 65, 0.1);
      border-left-color: #00ff41;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .spinner.small {
      width: 20px;
      height: 20px;
      border-width: 2px;
    }

    .spinner.medium {
      width: 40px;
      height: 40px;
      border-width: 3px;
    }

    .spinner.large {
      width: 60px;
      height: 60px;
      border-width: 4px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      color: #888;
      font-size: 0.875rem;
      text-align: center;
    }

    .dots {
      display: inline-block;
      width: 20px;
      text-align: left;
    }

    .dots::after {
      content: '...';
      animation: dots 1.5s steps(4, end) infinite;
    }

    @keyframes dots {
      0%, 20% { content: ''; }
      40% { content: '.'; }
      60% { content: '..'; }
      80%, 100% { content: '...'; }
    }
  `;

  render() {
    return html`
      <div class="spinner-container">
        <div class="spinner ${this.size}"></div>
        ${this.message ? html`
          <div class="message">
            ${this.message}<span class="dots"></span>
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'loading-spinner': LoadingSpinner;
  }
}