import { Ticket } from '../types';

export class CodeGenerator {
  constructor(private model: any) {}

  async generateCodeForTicket(
    ticket: Ticket, 
    existingCode: Map<string, string>
  ): Promise<Map<string, string>> {
    const newCode = new Map<string, string>();

    switch (ticket.type) {
      case 'migration':
        return this.generateProjectStructure();
      
      case 'model':
        return this.generateModel(ticket, existingCode);
      
      case 'view':
        return this.generateView(ticket, existingCode);
      
      case 'controller':
        return this.generateController(ticket, existingCode);
      
      case 'route':
        return this.generateRoutes(ticket, existingCode);
      
      case 'test':
        return this.generateTests(ticket, existingCode);
      
      case 'deployment':
        return this.generateDeploymentConfig(ticket);
      
      default:
        return newCode;
    }
  }

  private async generateProjectStructure(): Promise<Map<string, string>> {
    const code = new Map<string, string>();

    // index.html - Rails-like layout
    code.set('index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App</title>
  <link rel="stylesheet" href="app/assets/stylesheets/application.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="app/assets/javascripts/application.js"></script>
</body>
</html>`);

    // Main application CSS
    code.set('app/assets/stylesheets/application.css', `/* Rails-like Application Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Components */
.btn {
  display: inline-block;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.btn:hover {
  background: #0056b3;
}

/* Forms */
.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

/* Alerts */
.alert {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}`);

    // Main application JavaScript - Rails-like structure
    code.set('app/assets/javascripts/application.js', `// Rails-like Application JavaScript
import { Router } from './lib/router.js';
import { Application } from './lib/application.js';

// Initialize application
window.App = new Application();

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.initialize();
  App.router.start();
});`);

    // Base Application class
    code.set('app/assets/javascripts/lib/application.js', `// Base Application Class
export class Application {
  constructor() {
    this.models = {};
    this.controllers = {};
    this.views = {};
    this.router = null;
  }

  initialize() {
    console.log('Application initialized');
    this.loadModels();
    this.loadControllers();
    this.loadViews();
    this.setupRouter();
  }

  loadModels() {
    // Models will be loaded here
  }

  loadControllers() {
    // Controllers will be loaded here
  }

  loadViews() {
    // Views will be loaded here
  }

  setupRouter() {
    // Router setup will go here
  }

  // Rails-like render method
  render(viewName, data = {}) {
    const view = this.views[viewName];
    if (view) {
      const html = view.render(data);
      document.getElementById('app').innerHTML = html;
    }
  }
}`);

    // Simple Router
    code.set('app/assets/javascripts/lib/router.js', `// Simple Client-Side Router
export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
  }

  add(path, controller, action) {
    this.routes.set(path, { controller, action });
  }

  start() {
    window.addEventListener('popstate', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    const route = this.routes.get(path) || this.routes.get('/');
    
    if (route) {
      const controller = window.App.controllers[route.controller];
      if (controller && controller[route.action]) {
        controller[route.action]();
      }
    }
  }

  navigate(path) {
    window.history.pushState(null, '', path);
    this.handleRoute();
  }
}`);

    // Base Model class
    code.set('app/models/base_model.js', `// Base Model Class - Rails-like Active Record pattern
export class BaseModel {
  constructor(attributes = {}) {
    this.attributes = attributes;
    this.errors = {};
  }

  get(key) {
    return this.attributes[key];
  }

  set(key, value) {
    this.attributes[key] = value;
  }

  save() {
    if (this.validate()) {
      const collection = this.constructor.collectionName;
      const data = JSON.parse(localStorage.getItem(collection) || '[]');
      
      if (this.get('id')) {
        // Update existing
        const index = data.findIndex(item => item.id === this.get('id'));
        if (index !== -1) {
          data[index] = this.attributes;
        }
      } else {
        // Create new
        this.set('id', Date.now().toString());
        this.set('createdAt', new Date().toISOString());
        data.push(this.attributes);
      }
      
      this.set('updatedAt', new Date().toISOString());
      localStorage.setItem(collection, JSON.stringify(data));
      return true;
    }
    return false;
  }

  validate() {
    // Override in subclasses
    return true;
  }

  static all() {
    const collection = this.collectionName;
    const data = JSON.parse(localStorage.getItem(collection) || '[]');
    return data.map(attrs => new this(attrs));
  }

  static find(id) {
    const collection = this.collectionName;
    const data = JSON.parse(localStorage.getItem(collection) || '[]');
    const attrs = data.find(item => item.id === id);
    return attrs ? new this(attrs) : null;
  }

  destroy() {
    const collection = this.constructor.collectionName;
    const data = JSON.parse(localStorage.getItem(collection) || '[]');
    const filtered = data.filter(item => item.id !== this.get('id'));
    localStorage.setItem(collection, JSON.stringify(filtered));
  }
}`);

    // Base Controller class
    code.set('app/controllers/base_controller.js', `// Base Controller Class
export class BaseController {
  constructor() {
    this.beforeFilters = [];
  }

  before(action, callback) {
    this.beforeFilters.push({ action, callback });
  }

  runBeforeFilters(action) {
    this.beforeFilters
      .filter(f => f.action === action || f.action === '*')
      .forEach(f => f.callback.call(this));
  }

  render(viewName, data = {}) {
    window.App.render(viewName, data);
  }

  redirect(path) {
    window.App.router.navigate(path);
  }

  flash(type, message) {
    const flash = document.createElement('div');
    flash.className = \`alert alert-\\\${type}\`;
    flash.textContent = message;
    
    const container = document.querySelector('.container');
    if (container) {
      container.insertBefore(flash, container.firstChild);
      setTimeout(() => flash.remove(), 5000);
    }
  }
}`);

    // Base View class
    code.set('app/views/base_view.js', `// Base View Class
export class BaseView {
  constructor(name) {
    this.name = name;
    this.helpers = {};
  }

  render(data = {}) {
    // Override in subclasses
    return '<div>View not implemented</div>';
  }

  // Rails-like helpers
  linkTo(text, path, options = {}) {
    const className = options.class || '';
    return \`<a href="\\\${path}" class="\\\${className}" onclick="event.preventDefault(); window.App.router.navigate('\\\${path}')">\\\${text}</a>\`;
  }

  formFor(model, action, content) {
    return \`
      <form onsubmit="event.preventDefault(); \\\${action}">
        \\\${content}
      </form>
    \`;
  }

  textField(name, value = '', options = {}) {
    const className = options.class || 'form-control';
    const placeholder = options.placeholder || '';
    return \`<input type="text" name="\\\${name}" value="\\\${value}" class="\\\${className}" placeholder="\\\${placeholder}">\`;
  }

  submitButton(text = 'Submit', options = {}) {
    const className = options.class || 'btn btn-primary';
    return \`<button type="submit" class="\\\${className}">\\\${text}</button>\`;
  }
}`);

    return code;
  }

  private async generateModel(ticket: Ticket, existingCode: Map<string, string>): Promise<Map<string, string>> {
    const code = new Map<string, string>();
    const modelName = ticket.title.match(/Create (\w+) Model/)?.[1] || 'Model';
    
    const prompt = `Generate a JavaScript model class for ${modelName} that extends BaseModel.
The model should follow Rails Active Record patterns with:
- Validations
- Associations (if needed)
- Custom methods
- Static finder methods

Based on the ticket description: ${ticket.description}`;

    try {
      const result = await this.model.generateContent(prompt);
      const modelCode = result.response.text();
      
      code.set(`app/models/${modelName.toLowerCase()}.js`, modelCode);
    } catch (error) {
      // Fallback model
      code.set(`app/models/${modelName.toLowerCase()}.js`, `import { BaseModel } from './base_model.js';

export class ${modelName} extends BaseModel {
  static collectionName = '${modelName.toLowerCase()}s';

  validate() {
    this.errors = {};
    
    // Add validations here
    if (!this.get('name')) {
      this.errors.name = 'Name is required';
    }
    
    return Object.keys(this.errors).length === 0;
  }

  // Custom methods
  displayName() {
    return this.get('name') || 'Unnamed';
  }
}`);
    }

    return code;
  }

  private async generateView(ticket: Ticket, existingCode: Map<string, string>): Promise<Map<string, string>> {
    const code = new Map<string, string>();
    const viewName = ticket.title.match(/Create (\w+) View/)?.[1] || 'View';
    
    const prompt = `Generate a JavaScript view class for ${viewName} that extends BaseView.
The view should:
- Render HTML using template literals
- Use Rails-like helpers (linkTo, formFor, etc.)
- Be responsive and accessible
- Follow the description: ${ticket.description}`;

    try {
      const result = await this.model.generateContent(prompt);
      const viewCode = result.response.text();
      
      code.set(`app/views/${viewName.toLowerCase()}_view.js`, viewCode);
    } catch (error) {
      // Fallback view
      code.set(`app/views/${viewName.toLowerCase()}_view.js`, `import { BaseView } from './base_view.js';

export class ${viewName}View extends BaseView {
  constructor() {
    super('${viewName.toLowerCase()}');
  }

  render(data = {}) {
    return \`
      <div class="container">
        <h1>${viewName}</h1>
        <div class="content">
          <!-- View content goes here -->
        </div>
      </div>
    \`;
  }
}`);
    }

    return code;
  }

  private async generateController(ticket: Ticket, existingCode: Map<string, string>): Promise<Map<string, string>> {
    const code = new Map<string, string>();
    const controllerName = ticket.title.match(/Create (\w+)/)?.[1] || 'Controller';
    
    const prompt = `Generate a JavaScript controller class for ${controllerName} that extends BaseController.
The controller should:
- Implement actions: ${ticket.description}
- Follow Rails RESTful conventions
- Handle errors gracefully
- Use proper before filters if needed`;

    try {
      const result = await this.model.generateContent(prompt);
      const controllerCode = result.response.text();
      
      code.set(`app/controllers/${controllerName.toLowerCase()}_controller.js`, controllerCode);
    } catch (error) {
      // Fallback controller
      code.set(`app/controllers/${controllerName.toLowerCase()}_controller.js`, `import { BaseController } from './base_controller.js';

export class ${controllerName}Controller extends BaseController {
  constructor() {
    super();
  }

  index() {
    // List action
    this.render('${controllerName.toLowerCase()}/index');
  }

  show(id) {
    // Show single item
    this.render('${controllerName.toLowerCase()}/show', { id });
  }

  new() {
    // Show form for new item
    this.render('${controllerName.toLowerCase()}/new');
  }

  create(params) {
    // Create new item
    this.flash('success', 'Created successfully');
    this.redirect('/');
  }

  edit(id) {
    // Show form for editing
    this.render('${controllerName.toLowerCase()}/edit', { id });
  }

  update(id, params) {
    // Update existing item
    this.flash('success', 'Updated successfully');
    this.redirect('/');
  }

  destroy(id) {
    // Delete item
    this.flash('success', 'Deleted successfully');
    this.redirect('/');
  }
}`);
    }

    return code;
  }

  private async generateRoutes(ticket: Ticket, existingCode: Map<string, string>): Promise<Map<string, string>> {
    const code = new Map<string, string>();
    
    code.set('app/config/routes.js', `// Routes Configuration - Rails-like
export function setupRoutes(router) {
  // Root route
  router.add('/', 'HomeController', 'index');
  
  // RESTful routes
  // router.add('/items', 'ItemsController', 'index');
  // router.add('/items/new', 'ItemsController', 'new');
  // router.add('/items/:id', 'ItemsController', 'show');
  // router.add('/items/:id/edit', 'ItemsController', 'edit');
  
  // Add more routes as needed
}`);

    return code;
  }

  private async generateTests(ticket: Ticket, existingCode: Map<string, string>): Promise<Map<string, string>> {
    const code = new Map<string, string>();
    
    code.set('test/test_helper.js', `// Test Helper - Rails-like
export class TestCase {
  constructor(name) {
    this.name = name;
    this.assertions = 0;
    this.failures = [];
  }

  assert(condition, message) {
    this.assertions++;
    if (!condition) {
      this.failures.push(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    this.assert(
      actual === expected,
      message || \`Expected \${expected} but got \${actual}\`
    );
  }

  run() {
    console.log(\`Running \${this.name}...\`);
    try {
      this.test();
      console.log(\`✓ \${this.assertions} assertions\`);
    } catch (error) {
      console.error(\`✗ \${error.message}\`);
    }
  }
}`);

    code.set('test/models/model_test.js', `import { TestCase } from '../test_helper.js';

export class ModelTest extends TestCase {
  test() {
    // Add model tests here
    this.assert(true, 'Model should exist');
  }
}`);

    return code;
  }

  private async generateDeploymentConfig(ticket: Ticket): Promise<Map<string, string>> {
    const code = new Map<string, string>();
    
    code.set('package.json', `{
  "name": "autocoder-generated-app",
  "version": "1.0.0",
  "scripts": {
    "build": "echo 'No build needed for static files'",
    "preview": "npx serve ."
  }
}`);

    code.set('wrangler.toml', `name = "autocoder-app"
compatibility_date = "2023-12-01"

[site]
bucket = "./"

[[build.upload.rules]]
type = "CompiledWasm"
globs = ["**/*.wasm"]
fallthrough = true

[[build.upload.rules]]
type = "ESModule"
globs = ["**/*.js"]
fallthrough = true`);

    return code;
  }
}