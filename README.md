# 🤖 AutoCoder - Autonomous AI Web App Builder

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloudflare-orange)](https://shops-educational-margaret-personally.trycloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue)](https://www.typescriptlang.org/)
[![Lit](https://img.shields.io/badge/Lit-3.0+-blue)](https://lit.dev/)

AutoCoder is an autonomous AI agent that transforms your app ideas into fully functional web applications. Simply describe what you want to build, and AutoCoder will handle the entire development process - from planning to deployment!

## 🚀 Features

- **🧠 AI-Powered Development**: Uses Google's Gemini AI to understand your ideas and generate production-ready code
- **📋 Multi-Step Pipeline**: Follows a professional development workflow:
  - **Idea Analysis** - Understands your requirements
  - **Project Pitch** - Creates a structured project proposal
  - **Technical Spec** - Designs the architecture
  - **Ticket Generation** - Breaks down work into manageable tasks
  - **Code Generation** - Writes clean, Rails-like MVC code
  - **Testing** - Validates the generated application
  - **Deployment** - One-click deployment to Cloudflare
- **🎨 Rails-like Architecture**: Generates familiar MVC patterns with models, views, and controllers
- **👁️ Live Preview**: See your app come to life in real-time as it's being built
- **📦 Export & Deploy**: Download your project or deploy instantly to the cloud

## 🎯 What Can It Build?

AutoCoder excels at creating client-side web applications including:
- 🎮 Interactive games (memory cards, puzzles, arcade games)
- 📝 Productivity tools (todo lists, note-taking apps, timers)
- 🛠️ Utility applications (calculators, converters, generators)
- 📊 Data visualization tools
- 🎨 Creative tools (drawing apps, music makers)
- And much more!

## 🏗️ Architecture

AutoCoder generates applications following a Rails-like MVC pattern adapted for client-side apps:

```
app/
├── models/         # Data models with validation and persistence
├── views/          # UI components and templates
├── controllers/    # Business logic and user interaction handling
└── assets/         # Styles, scripts, and static resources
```

### Generated Code Features:
- **BaseModel**: Active Record-like pattern with localStorage persistence
- **BaseView**: Template rendering with Rails-like helpers
- **BaseController**: Request handling with before filters
- **Client-side routing**: No backend required
- **Form helpers**: Rails-style form generation
- **Validation**: Built-in model validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/franzenzenhofer/autocoder.git
cd autocoder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Gemini API key:
```bash
echo "VITE_GEMINI_API_KEY=your-api-key-here" > .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## 🎮 Usage

1. **Describe Your App**: Enter a detailed description of what you want to build
2. **Watch the Magic**: AutoCoder will analyze your idea and start building
3. **Preview**: See your app come to life in the live preview
4. **Deploy**: Click deploy to get a live URL via Cloudflare

### Example Ideas:
- "A memory card game with emojis, score tracking, and difficulty levels"
- "A pomodoro timer with task lists and statistics"
- "A markdown editor with live preview and export functionality"
- "A drawing app with different brushes and color picker"

## 🛠️ Development

### Project Structure
```
autocoder/
├── src/
│   ├── main.ts              # Application entry point
│   ├── core/                # Core AI and code generation logic
│   │   ├── AutoCodingAgent.ts
│   │   ├── CodeGenerator.ts
│   │   └── ProjectDeployer.ts
│   ├── components/          # UI components
│   │   ├── IdeaInput.ts
│   │   ├── ProjectPipeline.ts
│   │   ├── CodePreview.ts
│   │   └── DeploymentStatus.ts
│   └── types.ts             # TypeScript type definitions
├── index.html
├── vite.config.ts
└── package.json
```

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🌐 Deployment

AutoCoder can deploy generated apps to Cloudflare Pages automatically. For your own AutoCoder instance:

### Deploy to Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy dist --project-name=autocoder
```

### Self-Hosting
You can also host AutoCoder on any static hosting service:
- Vercel
- Netlify  
- GitHub Pages
- Your own server

## 📝 API Configuration

AutoCoder uses the Gemini 1.5 Flash model for fast, efficient code generation. You can configure:
- Model selection in `src/core/config.ts`
- Generation parameters (temperature, max tokens)
- Safety settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Areas for improvement:
- Additional app templates
- Support for more frameworks (React, Vue, etc.)
- Backend code generation
- Database integration
- More deployment options

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Lit](https://lit.dev/) - Fast, lightweight web components
- Powered by [Google Gemini](https://deepmind.google/technologies/gemini/) - Advanced AI for code generation
- Syntax highlighting by [Prism.js](https://prismjs.com/)
- Deployed with [Cloudflare Pages](https://pages.cloudflare.com/)

## 🔮 Future Roadmap

- [ ] Support for React/Vue/Angular apps
- [ ] Backend API generation (Node.js, Python)
- [ ] Database schema design and migrations
- [ ] Automated testing generation
- [ ] Multi-file editing and refactoring
- [ ] Collaborative features
- [ ] Template marketplace
- [ ] CI/CD pipeline generation

---

Made with ❤️ by an AI that builds AIs that build apps!