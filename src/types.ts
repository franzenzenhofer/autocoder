// Rails-like types for the autonomous coding agent

export type ProjectStatus = 
  | 'idle'
  | 'analyzing'
  | 'planning' 
  | 'generating-tickets'
  | 'coding'
  | 'testing'
  | 'deploying'
  | 'completed'
  | 'error';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: 'model' | 'view' | 'controller' | 'route' | 'migration' | 'test' | 'deployment';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  estimatedTime: number; // in minutes
  dependencies: string[]; // other ticket IDs
  generatedCode?: Map<string, string>;
}

export interface ProjectPitch {
  title: string;
  description: string;
  targetAudience: string;
  keyFeatures: string[];
  techStack: {
    frontend: string[];
    backend: string[];
    database?: string;
  };
  estimatedComplexity: 'simple' | 'medium' | 'complex';
}

export interface TechnicalSpec {
  architecture: 'spa' | 'mpa' | 'static' | 'game';
  models: Model[];
  views: View[];
  controllers: Controller[];
  routes: Route[];
  features: Feature[];
}

export interface Model {
  name: string;
  attributes: { [key: string]: string };
  relationships: Relationship[];
  validations: string[];
}

export interface View {
  name: string;
  path: string;
  components: string[];
  dataRequirements: string[];
}

export interface Controller {
  name: string;
  actions: string[];
  beforeFilters?: string[];
}

export interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  controller: string;
  action: string;
}

export interface Feature {
  name: string;
  description: string;
  userStories: string[];
  acceptanceCriteria: string[];
}

export interface Relationship {
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'hasAndBelongsToMany';
  model: string;
  options?: { [key: string]: any };
}

export interface DeploymentConfig {
  provider: 'cloudflare-pages' | 'cloudflare-workers' | 'static';
  buildCommand?: string;
  outputDirectory?: string;
  environment?: { [key: string]: string };
}

export interface TestCase {
  name: string;
  type: 'unit' | 'integration' | 'e2e';
  description: string;
  assertions: string[];
}