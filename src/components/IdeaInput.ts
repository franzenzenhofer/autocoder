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
      transition: all 0.3s;
    }

    textarea:focus {
      outline: none;
      border-color: #00ff41;
      box-shadow: 0 0 0 3px rgba(0, 255, 65, 0.1);
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

    button:active:not(:disabled) {
      transform: translateY(0);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .char-count {
      text-align: right;
      font-size: 0.75rem;
      color: #666;
      margin-top: 0.25rem;
    }

    .char-count.warning {
      color: #ff9900;
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
          @input=${this._handleInput}
          maxlength="500"
        ></textarea>
        <div class="char-count" id="char-count">0 / 500</div>
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

  private _handleInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    const charCount = this.shadowRoot?.querySelector('#char-count');
    if (charCount) {
      const count = textarea.value.length;
      charCount.textContent = `${count} / 500`;
      charCount.classList.toggle('warning', count > 450);
    }
  }

  private _handleSubmit() {
    const textarea = this.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    const idea = textarea?.value.trim();
    
    if (!idea) {
      // Shake the textarea if empty
      textarea.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        textarea.style.animation = '';
      }, 500);
      textarea.focus();
      return;
    }

    if (idea.length < 10) {
      alert('Please provide a more detailed description (at least 10 characters)');
      textarea.focus();
      return;
    }

    this.dispatchEvent(new CustomEvent('idea-submitted', {
      detail: { idea },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'idea-input': IdeaInput;
  }
}