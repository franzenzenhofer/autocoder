import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProjectPitch, TechnicalSpec, Ticket, DeploymentConfig } from '../types';
import { CodeGenerator } from './CodeGenerator';
import { ProjectDeployer } from './ProjectDeployer';
import { TestRunner } from './TestRunner';

export class AutoCodingAgent {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private codeGenerator: CodeGenerator;
  private deployer: ProjectDeployer;
  private testRunner: TestRunner;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 8192,
      }
    });
    
    this.codeGenerator = new CodeGenerator(this.model);
    this.deployer = new ProjectDeployer();
    this.testRunner = new TestRunner();
  }

  async createPitch(idea: string): Promise<ProjectPitch> {
    const prompt = `
You are an expert product manager and software architect. 
Create a detailed project pitch for this idea: "${idea}"

The project must be:
- A client-side web application (HTML/JS/CSS)
- Deployable as static files
- Fully functional without a backend server
- Using modern web APIs and localStorage for data persistence

Return a JSON object with this structure:
{
  "title": "Project Title",
  "description": "Detailed description",
  "targetAudience": "Who will use this",
  "keyFeatures": ["feature1", "feature2", ...],
  "techStack": {
    "frontend": ["HTML5", "CSS3", "JavaScript ES6+", ...],
    "backend": [],
    "database": "localStorage"
  },
  "estimatedComplexity": "simple|medium|complex"
}`;

    try {
      if (!idea || idea.trim().length < 10) {
        throw new Error('Please provide a more detailed description (at least 10 characters)');
      }

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Try to parse the whole response if no code block
      const cleanResponse = response.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error creating pitch:', error);
      // Return a default pitch with better error handling
      return {
        title: idea.substring(0, 50) || 'Untitled Project',
        description: `A web application based on: ${idea}`,
        targetAudience: 'General users',
        keyFeatures: ['Core functionality', 'User-friendly interface', 'Responsive design'],
        techStack: {
          frontend: ['HTML5', 'CSS3', 'JavaScript ES6+'],
          backend: [],
        },
        estimatedComplexity: 'medium',
      };
    }
  }

  async generateSpec(pitch: ProjectPitch): Promise<TechnicalSpec> {
    const prompt = `
You are a senior software architect following Rails-like MVC conventions.
Create a detailed technical specification for this project:

${JSON.stringify(pitch, null, 2)}

The spec should follow MVC architecture adapted for client-side apps:
- Models: Data structures and business logic (using JavaScript classes)
- Views: UI components and templates (using template literals or custom elements)
- Controllers: Event handlers and application logic
- Routes: Client-side routing for SPAs

Return a JSON object with this structure:
{
  "architecture": "spa|mpa|static|game",
  "models": [
    {
      "name": "ModelName",
      "attributes": { "attributeName": "type" },
      "relationships": [],
      "validations": []
    }
  ],
  "views": [
    {
      "name": "ViewName",
      "path": "/path",
      "components": ["Component1", "Component2"],
      "dataRequirements": ["model1", "model2"]
    }
  ],
  "controllers": [
    {
      "name": "ControllerName",
      "actions": ["index", "create", "update", "delete"]
    }
  ],
  "routes": [
    {
      "method": "GET",
      "path": "/",
      "controller": "HomeController",
      "action": "index"
    }
  ],
  "features": [
    {
      "name": "Feature Name",
      "description": "What it does",
      "userStories": ["As a user, I want to..."],
      "acceptanceCriteria": ["Given..., When..., Then..."]
    }
  ]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating spec:', error);
      // Return a minimal spec
      return {
        architecture: 'spa',
        models: [],
        views: [{ name: 'MainView', path: '/', components: ['App'], dataRequirements: [] }],
        controllers: [{ name: 'AppController', actions: ['init'] }],
        routes: [{ method: 'GET', path: '/', controller: 'AppController', action: 'init' }],
        features: pitch.keyFeatures.map(f => ({
          name: f,
          description: f,
          userStories: [`As a user, I want ${f}`],
          acceptanceCriteria: [`The ${f} should work as expected`],
        })),
      };
    }
  }

  async generateTickets(spec: TechnicalSpec): Promise<Ticket[]> {
    const tickets: Ticket[] = [];
    let ticketId = 1;

    // Create tickets following Rails-like order
    
    // 1. Setup and structure
    tickets.push({
      id: `T${ticketId++}`,
      title: 'Project Setup and Structure',
      description: 'Create initial project structure with directories for models, views, controllers',
      type: 'migration',
      priority: 'high',
      status: 'pending',
      estimatedTime: 5,
      dependencies: [],
    });

    // 2. Models
    for (const model of spec.models) {
      tickets.push({
        id: `T${ticketId++}`,
        title: `Create ${model.name} Model`,
        description: `Implement ${model.name} with attributes: ${Object.keys(model.attributes).join(', ')}`,
        type: 'model',
        priority: 'high',
        status: 'pending',
        estimatedTime: 10,
        dependencies: ['T1'],
      });
    }

    // 3. Views
    for (const view of spec.views) {
      tickets.push({
        id: `T${ticketId++}`,
        title: `Create ${view.name} View`,
        description: `Implement view at ${view.path} with components: ${view.components.join(', ')}`,
        type: 'view',
        priority: 'medium',
        status: 'pending',
        estimatedTime: 15,
        dependencies: spec.models.map((_, i) => `T${2 + i}`),
      });
    }

    // 4. Controllers
    for (const controller of spec.controllers) {
      tickets.push({
        id: `T${ticketId++}`,
        title: `Create ${controller.name}`,
        description: `Implement controller with actions: ${controller.actions.join(', ')}`,
        type: 'controller',
        priority: 'medium',
        status: 'pending',
        estimatedTime: 20,
        dependencies: [],
      });
    }

    // 5. Routes
    tickets.push({
      id: `T${ticketId++}`,
      title: 'Configure Routes',
      description: 'Set up client-side routing for all paths',
      type: 'route',
      priority: 'medium',
      status: 'pending',
      estimatedTime: 10,
      dependencies: [],
    });

    // 6. Features
    for (const feature of spec.features) {
      tickets.push({
        id: `T${ticketId++}`,
        title: `Implement ${feature.name}`,
        description: feature.description,
        type: 'controller',
        priority: 'medium',
        status: 'pending',
        estimatedTime: 30,
        dependencies: [],
      });
    }

    // 7. Testing
    tickets.push({
      id: `T${ticketId++}`,
      title: 'Create Test Suite',
      description: 'Write unit and integration tests',
      type: 'test',
      priority: 'low',
      status: 'pending',
      estimatedTime: 20,
      dependencies: [],
    });

    // 8. Deployment
    tickets.push({
      id: `T${ticketId++}`,
      title: 'Configure Deployment',
      description: 'Set up Cloudflare deployment configuration',
      type: 'deployment',
      priority: 'low',
      status: 'pending',
      estimatedTime: 5,
      dependencies: [],
    });

    return tickets;
  }

  async executeTicket(ticket: Ticket, existingCode: Map<string, string>): Promise<Map<string, string>> {
    return await this.codeGenerator.generateCodeForTicket(ticket, existingCode);
  }

  async testProject(code: Map<string, string>): Promise<boolean> {
    return await this.testRunner.runTests(code);
  }

  async deploy(code: Map<string, string>): Promise<string> {
    const config: DeploymentConfig = {
      provider: 'cloudflare-pages',
      outputDirectory: 'dist',
    };
    
    return await this.deployer.deploy(code, config);
  }
}