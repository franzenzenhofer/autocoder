import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AutoCodingAgent } from './core/AutoCodingAgent';
import { ProjectStatus, Ticket } from './types';
import './components/IdeaInput';
import './components/ProjectPipeline';
import './components/CodePreview';
import './components/DeploymentStatus';

@customElement('app-root')
export class AppRoot extends LitElement {
  @state() private agent: AutoCodingAgent;
  @state() private projectStatus: ProjectStatus = 'idle';
  @state() private currentIdea = '';
  @state() private tickets: Ticket[] = [];
  @state() private generatedCode: Map<string, string> = new Map();
  @state() private deploymentUrl = '';
  @state() private error = '';

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
      color: #e0e0e0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    header {
      text-align: center;
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 3rem;
      font-weight: 300;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #00ff41 0%, #00d4ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 1.25rem;
      color: #888;
    }

    .main-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }

    @media (max-width: 968px) {
      .main-grid {
        grid-template-columns: 1fr;
      }
    }

    .error {
      background: #ff00411a;
      border: 1px solid #ff0041;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
  `;

  constructor() {
    super();
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDH1mPElj5VOw1XviaQ-1Ften1TzbPRIR4';
    this.agent = new AutoCodingAgent(apiKey);
    
    // Remove loading screen
    document.querySelector('.loading')?.remove();
  }

  render() {
    return html`
      <div class="container">
        <header>
          <h1>AutoCoder</h1>
          <p class="subtitle">Autonomous AI Coding Agent - From Idea to Deployed App</p>
        </header>

        ${this.error ? html`<div class="error">${this.error}</div>` : ''}

        <idea-input
          .disabled=${this.projectStatus !== 'idle'}
          @idea-submitted=${this.handleIdeaSubmit}
        ></idea-input>

        <project-pipeline
          .status=${this.projectStatus}
          .tickets=${this.tickets}
          @ticket-completed=${this.handleTicketComplete}
        ></project-pipeline>

        <div class="main-grid">
          <code-preview
            .files=${this.generatedCode}
            .status=${this.projectStatus}
          ></code-preview>

          <deployment-status
            .status=${this.projectStatus}
            .url=${this.deploymentUrl}
          ></deployment-status>
        </div>
      </div>
    `;
  }

  private async handleIdeaSubmit(e: CustomEvent) {
    this.currentIdea = e.detail.idea;
    this.error = '';
    this.projectStatus = 'analyzing';
    
    try {
      // Step 1: Analyze idea and create pitch
      const pitch = await this.agent.createPitch(this.currentIdea);
      this.projectStatus = 'planning';
      
      // Step 2: Generate technical specification
      const spec = await this.agent.generateSpec(pitch);
      this.projectStatus = 'generating-tickets';
      
      // Step 3: Break down into tickets
      this.tickets = await this.agent.generateTickets(spec);
      this.projectStatus = 'coding';
      
      // Step 4: Execute tickets and generate code
      for (let i = 0; i < this.tickets.length; i++) {
        const ticket = this.tickets[i];
        ticket.status = 'in-progress';
        this.requestUpdate();
        
        const code = await this.agent.executeTicket(ticket, this.generatedCode);
        this.generatedCode = new Map([...this.generatedCode, ...code]);
        
        ticket.status = 'completed';
        this.requestUpdate();
      }
      
      // Step 5: Test and validate
      this.projectStatus = 'testing';
      await this.agent.testProject(this.generatedCode);
      
      // Step 6: Deploy
      this.projectStatus = 'deploying';
      this.deploymentUrl = await this.agent.deploy(this.generatedCode);
      
      this.projectStatus = 'completed';
      
    } catch (error: any) {
      this.error = error.message || 'An error occurred';
      this.projectStatus = 'error';
    }
  }

  private handleTicketComplete(e: CustomEvent) {
    const { ticketId } = e.detail;
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'completed';
      this.requestUpdate();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}