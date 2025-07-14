import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('idea-input')
export class IdeaInput extends LitElement {
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host {
      display: block;
      margin-bottom: 2rem;
    }

    .input-container {
      background: #1a1a2e;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    h2 {
      color: #00ff41;
      margin-bottom: 1rem;
      font-weight: 400;
    }

    textarea {
      width: 100%;
      min-height: 120px;
      background: #0f0f1e;
      border: 2px solid #2a2a3e;
      border-radius: 8px;
      padding: 1rem;
      color: #e0e0e0;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
      transition: border-color 0.3s;
    }

    textarea:focus {
      outline: none;
      border-color: #00ff41;
    }

    textarea:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .examples {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #888;
    }

    button {
      margin-top: 1rem;
      padding: 0.75rem 2rem;
      background: linear-gradient(135deg, #00ff41 0%, #00d4ff 100%);
      border: none;
      border-radius: 8px;
      color: #0a0a0a;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 65, 0.4);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  render() {
    return html`
      <div class="input-container">
        <h2>🚀 What would you like to build?</h2>
        <textarea
          id="idea-input"
          placeholder="Describe your app idea in detail..."
          ?disabled=${this.disabled}
          @keydown=${this._handleKeydown}
        ></textarea>
        <div class="examples">
          Examples: "A todo list with drag and drop", "A memory card game", 
          "A markdown editor with live preview", "A pomodoro timer with statistics"
        </div>
        <button
          @click=${this._handleSubmit}
          ?disabled=${this.disabled}
        >
          Generate App
        </button>
      </div>
    `;
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && e.ctrlKey) {
      this._handleSubmit();
    }
  }

  private _handleSubmit() {
    const textarea = this.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    const idea = textarea?.value.trim();
    
    if (idea) {
      this.dispatchEvent(new CustomEvent('idea-submitted', {
        detail: { idea },
        bubbles: true,
        composed: true
      }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'idea-input': IdeaInput;
  }
}