import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

interface ExampleTemplate {
  title: string;
  description: string;
  idea: string;
  icon: string;
}

@customElement('example-templates')
export class ExampleTemplates extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: 2rem;
    }

    .templates-container {
      background: #1a1a2e;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    h3 {
      color: #00ff41;
      margin-bottom: 1.5rem;
      font-weight: 400;
      text-align: center;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .template-card {
      background: #0f0f1e;
      border: 2px solid #2a2a3e;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
    }

    .template-card:hover {
      border-color: #00ff41;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 65, 0.2);
    }

    .template-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .template-title {
      color: #e0e0e0;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .template-description {
      color: #888;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .templates-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  private templates: ExampleTemplate[] = [
    {
      title: 'Memory Game',
      description: 'Classic card matching game with emojis',
      idea: 'Create a memory card game with emoji pairs, score tracking, timer, difficulty levels (easy/medium/hard), flip animations, and high score persistence using localStorage',
      icon: '🎮'
    },
    {
      title: 'Todo List App',
      description: 'Task manager with categories',
      idea: 'Build a todo list app with categories, priority levels, due dates, search/filter functionality, drag-and-drop reordering, and data persistence in localStorage',
      icon: '📝'
    },
    {
      title: 'Pomodoro Timer',
      description: 'Productivity timer with stats',
      idea: 'Create a Pomodoro timer with work/break intervals, task tracking, daily statistics, sound notifications, customizable durations, and productivity charts',
      icon: '⏱️'
    },
    {
      title: 'Drawing Canvas',
      description: 'Simple drawing application',
      idea: 'Build a drawing app with multiple brush sizes, color picker, eraser, undo/redo functionality, save to image, and drawing history',
      icon: '🎨'
    },
    {
      title: 'Quiz Game',
      description: 'Interactive trivia game',
      idea: 'Create a quiz game with multiple categories, difficulty levels, timer, score tracking, question progress bar, and results summary with correct answers',
      icon: '🧩'
    },
    {
      title: 'Markdown Editor',
      description: 'Live preview markdown editor',
      idea: 'Build a markdown editor with live preview, syntax highlighting, export to HTML/PDF, auto-save, fullscreen mode, and markdown cheat sheet',
      icon: '📄'
    }
  ];

  render() {
    return html`
      <div class="templates-container">
        <h3>🚀 Quick Start Templates</h3>
        <div class="templates-grid">
          ${this.templates.map(template => html`
            <div class="template-card" @click=${() => this.selectTemplate(template)}>
              <div class="template-icon">${template.icon}</div>
              <div class="template-title">${template.title}</div>
              <div class="template-description">${template.description}</div>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  private selectTemplate(template: ExampleTemplate) {
    this.dispatchEvent(new CustomEvent('template-selected', {
      detail: { idea: template.idea },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'example-templates': ExampleTemplates;
  }
}