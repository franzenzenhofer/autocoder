import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

@customElement('code-preview')
export class CodePreview extends LitElement {
  @property({ type: Object }) files: Map<string, string> = new Map();
  @property({ type: String }) status = '';
  @state() private selectedFile = '';
  @state() private showPreview = false;

  static styles = css`
    :host {
      display: block;
      height: 600px;
    }

    .preview-container {
      background: #1a1a2e;
      border-radius: 12px;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .tabs {
      display: flex;
      background: #0f0f1e;
      border-bottom: 1px solid #2a2a3e;
      overflow-x: auto;
      align-items: center;
      padding: 0 1rem;
    }

    .tab {
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      color: #888;
      cursor: pointer;
      font-size: 0.875rem;
      white-space: nowrap;
      transition: all 0.3s;
      border-bottom: 2px solid transparent;
    }

    .tab:hover {
      color: #e0e0e0;
    }

    .tab.active {
      color: #00ff41;
      border-bottom-color: #00ff41;
    }

    .preview-toggle {
      margin-left: auto;
      padding: 0.5rem 1rem;
      background: #2a2a3e;
      border: none;
      border-radius: 4px;
      color: #e0e0e0;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.3s;
    }

    .preview-toggle:hover {
      background: #00ff41;
      color: #0a0a0a;
    }

    .content {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .code-view {
      height: 100%;
      overflow: auto;
      background: #0f0f1e;
      padding: 1rem;
    }

    .live-preview {
      height: 100%;
      width: 100%;
      background: white;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    pre {
      margin: 0;
      font-family: 'Fira Code', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    code {
      color: #e0e0e0;
    }

    /* Prism theme overrides */
    .token.comment { color: #6a737d; }
    .token.string { color: #79b8ff; }
    .token.keyword { color: #f97583; }
    .token.function { color: #b392f0; }
    .token.number { color: #79b8ff; }
    .token.operator { color: #f97583; }
    .token.property { color: #79b8ff; }
    .token.tag { color: #85e89d; }
    .token.attr-name { color: #b392f0; }
    .token.attr-value { color: #79b8ff; }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #666;
      font-size: 1.125rem;
    }

    .file-tree {
      background: #0f0f1e;
      padding: 1rem;
      overflow-y: auto;
      max-height: 200px;
      border-bottom: 1px solid #2a2a3e;
    }

    .file-item {
      padding: 0.25rem 0;
      color: #888;
      cursor: pointer;
      font-size: 0.875rem;
      font-family: monospace;
      transition: color 0.2s;
    }

    .file-item:hover {
      color: #00ff41;
    }

    .file-item.selected {
      color: #00d4ff;
    }
  `;

  updated() {
    // Select first file if none selected
    if (!this.selectedFile && this.files.size > 0) {
      this.selectedFile = Array.from(this.files.keys())[0];
    }
  }

  render() {
    const fileList = Array.from(this.files.keys()).sort();
    
    return html`
      <div class="preview-container">
        <div class="tabs">
          <button 
            class="tab ${!this.showPreview ? 'active' : ''}"
            @click=${() => this.showPreview = false}
          >
            📝 Code
          </button>
          <button 
            class="tab ${this.showPreview ? 'active' : ''}"
            @click=${() => this.showPreview = true}
          >
            👁️ Preview
          </button>
          ${this.status === 'completed' ? html`
            <button class="preview-toggle" @click=${this._downloadProject}>
              📥 Download Project
            </button>
          ` : ''}
        </div>
        
        <div class="content">
          ${this.files.size === 0 ? html`
            <div class="empty-state">
              Generated code will appear here...
            </div>
          ` : this.showPreview ? this.renderPreview() : this.renderCode(fileList)}
        </div>
      </div>
    `;
  }

  private renderCode(fileList: string[]) {
    return html`
      <div class="file-tree">
        ${fileList.map(file => html`
          <div 
            class="file-item ${file === this.selectedFile ? 'selected' : ''}"
            @click=${() => this.selectedFile = file}
          >
            📄 ${file}
          </div>
        `)}
      </div>
      <div class="code-view">
        ${this.renderFileContent()}
      </div>
    `;
  }

  private renderFileContent() {
    if (!this.selectedFile) return '';
    
    const content = this.files.get(this.selectedFile) || '';
    const language = this.getLanguageFromFile(this.selectedFile);
    const highlighted = Prism.highlight(content, Prism.languages[language], language);
    
    return html`
      <pre><code class="language-${language}">${unsafeHTML(highlighted)}</code></pre>
    `;
  }

  private renderPreview() {
    const htmlContent = this.files.get('index.html') || '';
    const cssFiles = Array.from(this.files.entries())
      .filter(([path]) => path.endsWith('.css'))
      .map(([path, content]) => `<style>${content}</style>`)
      .join('\n');
    
    const jsFiles = Array.from(this.files.entries())
      .filter(([path]) => path.endsWith('.js'))
      .map(([path, content]) => `<script type="module">${content}</script>`)
      .join('\n');
    
    const fullHTML = htmlContent
      .replace('</head>', `${cssFiles}</head>`)
      .replace('</body>', `${jsFiles}</body>`);
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    return html`
      <div class="live-preview">
        <iframe src=${url}></iframe>
      </div>
    `;
  }

  private getLanguageFromFile(filename: string): string {
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.html')) return 'markup';
    if (filename.endsWith('.json')) return 'json';
    return 'plaintext';
  }

  private async _downloadProject() {
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    
    for (const [path, content] of this.files.entries()) {
      zip.file(path, content);
    }
    
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autocoder-project.zip';
    a.click();
    URL.revokeObjectURL(url);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'code-preview': CodePreview;
  }
}