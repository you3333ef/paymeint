# Bolt-Chef Unified

<div align="center">

**AI-Powered Full-Stack Web Development Tool**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Convex](https://img.shields.io/badge/Convex-4A3FFF?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNEEzRkZGIi8+Cjwvc3ZnPgo=)](https://convex.dev/)
[![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)

</div>

## 🌟 Features

- **🤖 19+ AI Providers**: OpenAI, Anthropic, Google, Groq, xAI, DeepSeek, Mistral, and more
- **⚡ Reactive Backend**: Powered by Convex with real-time database and serverless APIs
- **💎 Modern UI**: Beautiful design inspired by bolt.new with dark/light themes
- **🎨 Split-Pane Editor**: Monaco Editor with syntax highlighting and IntelliSense
- **📦 Multiple Deployment Options**: Netlify, Vercel, GitHub Pages, Cloudflare
- **🔒 File Locking**: Collaborative editing without conflicts
- **💬 AI Chat Interface**: Build applications with natural language
- **🖥️ Desktop App**: Electron-based cross-platform desktop application
- **🐳 Docker Support**: Containerized deployment ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Convex account (free tier available)
- API keys for your preferred AI providers

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bolt-chef-unified.git
   cd bolt-chef-unified
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Initialize Convex**
   ```bash
   pnpm convex:dev
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

### Desktop App

```bash
# Development mode
pnpm electron:dev

# Build for production
pnpm electron:build
```

### Docker

```bash
# Development
docker-compose -f docker/docker-compose.yml up

# Production
docker-compose -f docker/docker-compose.prod.yml up
```

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS + shadcn/ui for styling
- Monaco Editor for code editing
- React Router for navigation

**Backend:**
- Convex for reactive database and serverless functions
- Real-time subscriptions
- Authentication built-in
- Background workflows

**Desktop:**
- Electron for cross-platform desktop app
- Secure IPC with context isolation
- Auto-updater support

**AI Integration:**
- Multi-provider architecture
- Streaming responses
- Token usage tracking
- Provider-specific optimizations

### Project Structure

```
bolt-chef-unified/
├── app/                    # Main React application
│   ├── components/         # React components
│   │   ├── ui/            # Base UI components (shadcn)
│   │   ├── editor/        # Code editor components
│   │   ├── chat/          # AI chat interface
│   │   ├── settings/      # Settings panels
│   │   └── ...
│   ├── lib/               # Utilities and integrations
│   │   ├── ai/            # AI provider integrations
│   │   ├── convex/        # Convex client
│   │   └── utils/         # Helper functions
│   ├── stores/            # Zustand state management
│   └── types/             # TypeScript definitions
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   ├── mutations.ts       # Data mutations
│   ├── queries.ts         # Data queries
│   └── functions.ts       # Server functions
├── electron/              # Electron desktop app
│   ├── main.ts            # Main process
│   └── preload.ts         # Preload script
├── docs/                  # Documentation
└── public/                # Static assets
```

## 🎨 Design System

### Colors

The application uses a sophisticated color system with support for light and dark themes:

- **Primary**: Indigo gradient (#6366f1 to #8b5cf6)
- **Background**: Adaptive based on theme
- **Card**: Semi-transparent with backdrop blur
- **Borders**: Subtle borders with reduced opacity

### Components

All UI components are built with:
- Tailwind CSS for styling
- Radix UI primitives for accessibility
- Framer Motion for animations
- Consistent spacing (4px base unit)
- Rounded corners (8-12px)

## 🤖 AI Providers

Supported providers include:

- **OpenAI**: GPT-4o, GPT-4 Turbo
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus
- **Google**: Gemini Pro, Gemini Pro Vision
- **Groq**: Llama 3.1 70B, Mixtral 8x7B
- **xAI**: Grok Beta, Grok Vision
- **DeepSeek**: DeepSeek Coder, DeepSeek Chat
- **Mistral**: Mistral Large, Mixtral 8x7B
- **Cohere**: Command R, Command R+
- **Together AI**: Multiple open-source models
- **Perplexity**: Sonar models
- **HuggingFace**: Open-source models
- **OpenRouter**: Unified multi-provider API
- **Ollama**: Local model support
- And more!

## 📊 Database Schema

### Users
- Email and name
- Creation timestamp

### Projects
- User association
- Files (key-value store)
- Running status
- Timestamps

### Chats
- Project association
- AI provider and model
- Message history
- Timestamps

### Deployments
- Project association
- Platform (Netlify, Vercel, etc.)
- URL and status
- Build logs

### File Locks
- Prevents conflicts during AI generation
- Tracks user and timestamp

### User Settings
- Theme preference
- Provider configurations
- Editor settings
- AI preferences

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                 # Start Vite dev server
pnpm convex:dev         # Start Convex dev
pnpm electron:dev       # Start Electron app

# Building
pnpm build              # Build for production
pnpm convex:deploy      # Deploy Convex backend
pnpm electron:build     # Build Electron app

# Linting and Testing
pnpm lint               # Run ESLint
pnpm type-check         # TypeScript type checking
pnpm test               # Run tests
```

### Adding a New AI Provider

1. Add provider config to `app/lib/ai/providers/`
2. Update `convex/helpers.ts` with provider info
3. Add validation logic
4. Update UI components for the provider
5. Test integration

### Customizing the Theme

Edit `tailwind.config.ts` and `app/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  /* ... more colors */
}
```

## 🚢 Deployment

### Web App

1. **Convex Backend**
   ```bash
   pnpm convex:deploy
   ```

2. **Frontend**
   - Deploy to Vercel, Netlify, or any static host
   - Set environment variables
   - Configure domain

### Docker

```bash
# Build image
docker build -t bolt-chef-unified .

# Run container
docker run -p 3000:3000 bolt-chef-unified
```

### Desktop App

```bash
# Build for current platform
pnpm electron:build

# Build for all platforms
pnpm electron:build -mwl
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Bolt.diy](https://github.com/stackblitz-labs/bolt.diy) - Original inspiration
- [Chef](https://github.com/get-convex/chef) - Convex-based architecture
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Convex](https://convex.dev/) - Reactive backend platform

## 📞 Support

- GitHub Issues: [Report bugs and feature requests](https://github.com/yourusername/bolt-chef-unified/issues)
- Discussions: [Community support](https://github.com/yourusername/bolt-chef-unified/discussions)
- Documentation: [Full documentation](https://docs.bolt-chef-unified.com)

## 🗺️ Roadmap

- [ ] VSCode extension
- [ ] Mobile app (React Native)
- [ ] More deployment platforms
- [ ] Enhanced file management
- [ ] Collaborative editing
- [ ] Plugin system
- [ ] Advanced testing tools
- [ ] Performance monitoring

---

<div align="center">

Built with ❤️ by the Bolt-Chef Unified team

[Website](https://bolt-chef-unified.com) •
[Documentation](https://docs.bolt-chef-unified.com) •
[Discord](https://discord.gg/bolt-chef) •
[Twitter](https://twitter.com/boltchef)

</div>
