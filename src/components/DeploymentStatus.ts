import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('deployment-status')
export class DeploymentStatus extends LitElement {
  @property({ type: String }) status = '';
  @property({ type: String }) url = '';

  static styles = css`
    :host {
      display: block;
      height: 600px;
    }

    .deployment-container {
      background: #1a1a2e;
      border-radius: 12px;
      height: 100%;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .status-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .pulse {
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    h3 {
      color: #00ff41;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      font-weight: 400;
    }

    .status-message {
      color: #888;
      margin-bottom: 2rem;
      font-size: 1.125rem;
    }

    .deployment-url {
      background: #0f0f1e;
      border: 2px solid #00d4ff;
      border-radius: 8px;
      padding: 1rem 2rem;
      margin-bottom: 1rem;
    }

    .deployment-url a {
      color: #00d4ff;
      text-decoration: none;
      font-size: 1.125rem;
      font-family: monospace;
    }

    .deployment-url a:hover {
      text-decoration: underline;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #00ff41 0%, #00d4ff 100%);
      color: #0a0a0a;
      font-weight: 600;
    }

    .btn-secondary {
      background: #2a2a3e;
      color: #e0e0e0;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 3rem;
      width: 100%;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 600;
      color: #00ff41;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #888;
      font-size: 0.875rem;
    }

    .loading {
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .cloudflare-badge {
      margin-top: 2rem;
      padding: 1rem;
      background: #0f0f1e;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #888;
      font-size: 0.875rem;
    }
  `;

  render() {
    const statusConfig = this.getStatusConfig();
    
    return html`
      <div class="deployment-container">
        <div class="status-icon ${statusConfig.animate ? 'loading' : ''}">
          ${statusConfig.icon}
        </div>
        
        <h3>${statusConfig.title}</h3>
        <p class="status-message">${statusConfig.message}</p>
        
        ${this.status === 'completed' && this.url ? html`
          <div class="deployment-url pulse">
            <a href=${this.url} target="_blank">${this.url}</a>
          </div>
          
          <div class="actions">
            <button class="btn-primary" @click=${() => window.open(this.url, '_blank')}>
              🚀 Open Live App
            </button>
            <button class="btn-secondary" @click=${this._shareProject}>
              📤 Share
            </button>
          </div>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-value">100%</div>
              <div class="stat-label">Uptime</div>
            </div>
            <div class="stat">
              <div class="stat-value">< 50ms</div>
              <div class="stat-label">Response Time</div>
            </div>
            <div class="stat">
              <div class="stat-value">Global</div>
              <div class="stat-label">CDN Coverage</div>
            </div>
          </div>
          
          <div class="cloudflare-badge">
            <span>⚡</span>
            <span>Powered by Cloudflare Pages</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  private getStatusConfig() {
    const configs = {
      idle: {
        icon: '🚀',
        title: 'Ready to Launch',
        message: 'Your app will be deployed here when ready',
        animate: false
      },
      analyzing: {
        icon: '🔍',
        title: 'Analyzing Idea',
        message: 'Understanding your requirements...',
        animate: true
      },
      planning: {
        icon: '📋',
        title: 'Creating Plan',
        message: 'Designing the architecture...',
        animate: true
      },
      'generating-tickets': {
        icon: '🎫',
        title: 'Generating Tickets',
        message: 'Breaking down into tasks...',
        animate: true
      },
      coding: {
        icon: '💻',
        title: 'Writing Code',
        message: 'AI is coding your app...',
        animate: true
      },
      testing: {
        icon: '🧪',
        title: 'Testing',
        message: 'Validating the generated code...',
        animate: true
      },
      deploying: {
        icon: '🚀',
        title: 'Deploying',
        message: 'Uploading to Cloudflare...',
        animate: true
      },
      completed: {
        icon: '✨',
        title: 'App is Live!',
        message: 'Your app has been successfully deployed',
        animate: false
      },
      error: {
        icon: '❌',
        title: 'Deployment Failed',
        message: 'Something went wrong. Please try again.',
        animate: false
      }
    };

    return configs[this.status as keyof typeof configs] || configs.idle;
  }

  private async _shareProject() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my AI-generated app!',
          text: 'Built with AutoCoder - an AI that creates apps from ideas',
          url: this.url
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(this.url);
      alert('URL copied to clipboard!');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'deployment-status': DeploymentStatus;
  }
}