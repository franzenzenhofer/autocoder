import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ProjectStatus, Ticket } from '../types';

@customElement('project-pipeline')
export class ProjectPipeline extends LitElement {
  @property({ type: String }) status: ProjectStatus = 'idle';
  @property({ type: Array }) tickets: Ticket[] = [];

  static styles = css`
    :host {
      display: block;
      margin-bottom: 2rem;
    }

    .pipeline-container {
      background: #1a1a2e;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    h3 {
      color: #00ff41;
      margin-bottom: 1.5rem;
      font-weight: 400;
    }

    .stages {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .stage {
      flex: 1;
      min-width: 120px;
      text-align: center;
      position: relative;
    }

    .stage-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #2a2a3e;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.5rem;
      font-size: 1.5rem;
      transition: all 0.3s;
    }

    .stage.active .stage-icon {
      background: #00ff41;
      color: #0a0a0a;
      animation: pulse 2s infinite;
    }

    .stage.completed .stage-icon {
      background: #00d4ff;
      color: #0a0a0a;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .stage-label {
      font-size: 0.875rem;
      color: #888;
    }

    .stage.active .stage-label,
    .stage.completed .stage-label {
      color: #e0e0e0;
    }

    .tickets {
      max-height: 400px;
      overflow-y: auto;
    }

    .ticket {
      background: #0f0f1e;
      border: 1px solid #2a2a3e;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s;
    }

    .ticket.in-progress {
      border-color: #00ff41;
      background: #00ff4110;
    }

    .ticket.completed {
      border-color: #00d4ff;
      opacity: 0.7;
    }

    .ticket-status {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #2a2a3e;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .ticket.in-progress .ticket-status {
      background: #00ff41;
      animation: spin 1s linear infinite;
    }

    .ticket.completed .ticket-status {
      background: #00d4ff;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .ticket-info {
      flex: 1;
    }

    .ticket-title {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .ticket-description {
      font-size: 0.875rem;
      color: #888;
    }

    .ticket-time {
      font-size: 0.75rem;
      color: #666;
    }
  `;

  private stages = [
    { id: 'analyzing', label: 'Analyzing', icon: '🔍' },
    { id: 'planning', label: 'Planning', icon: '📋' },
    { id: 'generating-tickets', label: 'Tickets', icon: '🎫' },
    { id: 'coding', label: 'Coding', icon: '💻' },
    { id: 'testing', label: 'Testing', icon: '🧪' },
    { id: 'deploying', label: 'Deploying', icon: '🚀' },
    { id: 'completed', label: 'Live!', icon: '✨' },
  ];

  render() {
    return html`
      <div class="pipeline-container">
        <h3>🏗️ Build Pipeline</h3>
        
        <div class="stages">
          ${this.stages.map(stage => this.renderStage(stage))}
        </div>
        
        ${this.tickets.length > 0 ? html`
          <h4 style="color: #00ff41; margin-bottom: 1rem;">📝 Tickets</h4>
          <div class="tickets">
            ${this.tickets.map(ticket => this.renderTicket(ticket))}
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderStage(stage: { id: string; label: string; icon: string }) {
    const stageIndex = this.stages.findIndex(s => s.id === stage.id);
    const currentIndex = this.stages.findIndex(s => s.id === this.status);
    
    const isActive = stage.id === this.status;
    const isCompleted = currentIndex > stageIndex;
    
    return html`
      <div class="stage ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
        <div class="stage-icon">${stage.icon}</div>
        <div class="stage-label">${stage.label}</div>
      </div>
    `;
  }

  private renderTicket(ticket: Ticket) {
    const statusIcon = ticket.status === 'completed' ? '✓' : 
                      ticket.status === 'in-progress' ? '⚡' : '○';
    
    return html`
      <div class="ticket ${ticket.status}">
        <div class="ticket-status">${statusIcon}</div>
        <div class="ticket-info">
          <div class="ticket-title">${ticket.title}</div>
          <div class="ticket-description">${ticket.description}</div>
          <div class="ticket-time">Est: ${ticket.estimatedTime} min</div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-pipeline': ProjectPipeline;
  }
}