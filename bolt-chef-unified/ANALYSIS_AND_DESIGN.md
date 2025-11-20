# Bolt-Chef Unified: Analysis & Design Document

## Repository Analysis

### Bolt.diy Analysis

**Core Strengths:**
- 19+ AI provider integrations (OpenAI, Anthropic, Google, Groq, xAI, etc.)
- Modern React + TypeScript + Vite architecture
- File locking system for collaboration
- Integrated terminal for command execution
- Diff view for code changes
- Git integration
- Multiple deployment options (Netlify, Vercel, GitHub Pages)
- Supabase integration
- Voice prompting capability
- Project snapshot restoration
- Browser-based Node.js development
- Bulk chat operations
- MCP (Model Context Protocol) support

**Technology Stack:**
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Package Manager: pnpm
- Desktop: Electron
- Container: Docker
- Cloud: Cloudflare Wrangler

**UI/UX Features:**
- Modern settings interface with provider panels
- Grid card layout for providers
- Real-time API key validation with visual indicators
- Keyboard navigation (Cmd+K/Ctrl+K)
- Provider-specific interfaces

### Chef Analysis

**Core Strengths:**
- Built on Convex reactive database
- Full-stack generation with backend awareness
- Agent loop system (chef-agent)
- Real-time capabilities with live updates
- Multi-model AI support (Anthropic, Google, OpenAI, xAI)
- CLI interface (chefshot)
- Testing framework (test-kitchen)
- Template-based project generation
- Self-hosted option
- Comprehensive monorepo structure

**Technology Stack:**
- Frontend: React, TypeScript
- Database: Convex (reactive)
- Build: Vite
- Styling: Tailwind CSS
- Package Manager: pnpm (monorepo)
- AI: Multiple provider APIs

**Architecture Highlights:**
- Monorepo with separated concerns
- Agent loop for AI processing
- Serverless API integration
- Reactive database with real-time updates
- OAuth integration
- Production-ready deployment

## Modern UI/UX Design Principles (2025)

### Visual Design
- **Dark/Light Mode**: Seamless theme switching
- **Glassmorphism**: Subtle transparency and blur effects
- **Gradients**: Sophisticated color transitions
- **Micro-animations**: Smooth, purposeful transitions
- **Rounded Corners**: Consistent border radius (8-12px)
- **Shadows**: Layered, soft shadows for depth

### Layout Patterns
- **Split View**: Editor + Preview panes
- **Command Palette**: Cmd+K/Ctrl+K quick actions
- **Sidebar Navigation**: Collapsible, contextual panels
- **Floating Action Buttons**: Quick access to key actions
- **Breadcrumbs**: Clear navigation hierarchy
- **Status Indicators**: Real-time feedback

### Interaction Patterns
- **Progressive Disclosure**: Show details on demand
- **Inline Editing**: Edit without modal dialogs
- **Drag & Drop**: Intuitive file/project handling
- **Keyboard Shortcuts**: Power user efficiency
- **Context Menus**: Right-click functionality
- **Auto-save**: Continuous state preservation

## Merged Application Architecture

### Project Name: Bolt-Chef Unified

### Core Vision
Combine bolt.diy's extensive AI provider ecosystem with Chef's reactive backend capabilities and Convex integration, featuring a modern UI inspired by bolt.new design principles.

### Key Features to Implement

#### 1. AI Provider System (from bolt.diy)
- 19+ provider integrations
- Real-time API key validation
- Provider-specific model selection
- Unified provider interface

#### 2. Reactive Backend (from Chef/Convex)
- Convex reactive database
- Real-time updates
- Serverless API generation
- Background workflows
- Authentication built-in

#### 3. Modern UI (inspired by bolt.new)
- Split-pane editor layout
- Glassmorphism design
- Gradient accents
- Smooth animations
- Dark/Light theme support
- Responsive design

#### 4. Enhanced File Management
- File locking (from bolt.diy)
- Diff view
- Git integration
- Project snapshots
- Multi-tab editing

#### 5. Deployment & Integration
- Multiple deployment options
- Supabase integration
- OAuth support
- CLI tools
- Desktop app (Electron)

### Technical Architecture

#### Frontend Stack
```
React 18+ (with Suspense)
TypeScript
Vite (build tool)
Tailwind CSS (styling)
Zustand (state management)
React Router (routing)
Monaco Editor (code editor)
```

#### Backend Stack
```
Convex (database & backend)
React Query (data fetching)
WebSockets (real-time)
Node.js runtime
```

#### AI Integration
```
Multiple provider SDKs
Unified provider interface
Real-time streaming
Token usage tracking
```

#### Desktop & Mobile
```
Electron (desktop app)
PWA support (mobile)
Capacitor (optional native)
```

### Directory Structure

```
bolt-chef-unified/
├── app/                          # Main application
│   ├── components/              # React components
│   │   ├── ui/                  # Base UI components
│   │   ├── editor/              # Code editor
│   │   ├── preview/             # Preview panel
│   │   ├── chat/                # Chat interface
│   │   └── settings/            # Settings panels
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities
│   │   ├── ai/                  # AI provider integrations
│   │   ├── convex/              # Convex client
│   │   └── utils/               # Helper functions
│   ├── pages/                   # Page components
│   ├── stores/                  # State management
│   └── types/                   # TypeScript types
├── convex/                      # Convex backend
│   ├── schema.ts                # Database schema
│   ├── mutations.ts             # Data mutations
│   ├── queries.ts               # Data queries
│   └── functions.ts             # Server functions
├── electron/                    # Desktop app
│   ├── main.ts                  # Electron main process
│   ├── preload.ts               # Preload script
│   └── icons/                   # App icons
├── docs/                        # Documentation
├── public/                      # Static assets
├── docker/                      # Docker configs
├── chef-agent/                  # AI agent system
├── template/                    # Project templates
└── config files...
```

### Component Architecture

#### Core Components

1. **EditorPane**
   - Monaco Editor integration
   - Syntax highlighting
   - Auto-completion
   - Multiple tabs
   - File tree

2. **PreviewPane**
   - Live preview
   - Dev server integration
   - Multiple viewport sizes
   - Error overlay

3. **ChatInterface**
   - AI conversation
   - Streaming responses
   - Code blocks
   - File attachments
   - Provider selection

4. **ProviderSettings**
   - Provider cards
   - API key validation
   - Model selection
   - Usage metrics

5. **DeploymentPanel**
   - Platform selection
   - Build logs
   - Deployment status
   - URL management

6. **FileManager**
   - File tree view
   - Drag & drop
   - Git status
   - Diff viewer

### Database Schema (Convex)

```typescript
// Users
const users = defineTable({
  email: v.string(),
  name: v.string(),
  createdAt: v.number(),
}).index("by_email");

// Projects
const projects = defineTable({
  userId: v.id("users"),
  name: v.string(),
  description: v.optional(v.string()),
  files: v.record(v.string(), v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_user");

// Chats
const chats = defineTable({
  projectId: v.id("projects"),
  provider: v.string(),
  model: v.string(),
  messages: v.array(v.object({
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.number(),
  })),
  createdAt: v.number(),
}).index("by_project");

// Deployments
const deployments = defineTable({
  projectId: v.id("projects"),
  platform: v.string(),
  url: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("building"),
    v.literal("deployed"),
    v.literal("failed")
  ),
  logs: v.array(v.string()),
  createdAt: v.number(),
}).index("by_project");
```

### AI Provider Integration

```typescript
interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  validateApiKey: (key: string) => Promise<boolean>;
  chat: (messages: ChatMessage[]) => Promise<StreamResponse>;
  countTokens: (text: string) => number;
}

interface AIModel {
  id: string;
  name: string;
  contextLength: number;
  pricing: {
    input: number;
    output: number;
  };
}
```

### State Management

```typescript
// Zustand stores
interface AppState {
  theme: 'light' | 'dark' | 'system';
  currentProject: Project | null;
  activeFile: string | null;
  providers: ProviderConfig[];
  chat: ChatMessage[];
}

// Store structure
const useAppStore = create<AppState>((set) => ({
  theme: 'system',
  currentProject: null,
  activeFile: null,
  providers: [],
  chat: [],
}));
```

### Implementation Roadmap

#### Phase 1: Foundation (Week 1-2)
- [ ] Initialize project with Vite + React + TypeScript
- [ ] Setup Convex backend
- [ ] Implement basic routing
- [ ] Create component library (ui components)
- [ ] Setup Tailwind CSS with dark/light mode
- [ ] Implement responsive layout

#### Phase 2: Core Features (Week 3-4)
- [ ] Implement file manager
- [ ] Integrate Monaco Editor
- [ ] Create split-pane layout
- [ ] Build chat interface
- [ ] Implement basic AI provider integration (2-3 providers)

#### Phase 3: Advanced Features (Week 5-6)
- [ ] Add all 19+ AI providers
- [ ] Implement real-time preview
- [ ] Build deployment system
- [ ] Add file locking
- [ ] Implement git integration
- [ ] Create project templates

#### Phase 4: Polish & Enhancements (Week 7-8)
- [ ] Add animations and transitions
- [ ] Implement voice prompting
- [ ] Build CLI tools
- [ ] Create Electron desktop app
- [ ] Add PWA support
- [ ] Performance optimization

#### Phase 5: Production (Week 9-10)
- [ ] Comprehensive testing
- [ ] Documentation
- [ ] Deployment setup
- [ ] Security audit
- [ ] Beta release

### Design System

#### Colors

```css
/* Light Theme */
--bg-primary: #ffffff;
--bg-secondary: #f8f9fa;
--bg-tertiary: #e9ecef;
--text-primary: #212529;
--text-secondary: #6c757d;
--accent-primary: #6366f1; /* Indigo */
--accent-secondary: #8b5cf6; /* Purple */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;

/* Dark Theme */
--bg-primary: #0f172a;
--bg-secondary: #1e293b;
--bg-tertiary: #334155;
--text-primary: #f1f5f9;
--text-secondary: #94a3b8;
--accent-primary: #818cf8;
--accent-secondary: #a78bfa;
```

#### Typography

```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Text Styles */
.heading-xl { font-size: 3rem; font-weight: 700; line-height: 1.2; }
.heading-lg { font-size: 2rem; font-weight: 600; line-height: 1.3; }
.heading-md { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
.body-lg { font-size: 1.125rem; font-weight: 400; line-height: 1.6; }
.body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
.body-sm { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }
.caption { font-size: 0.75rem; font-weight: 400; line-height: 1.4; }
```

#### Spacing Scale

```css
/* 4px base unit */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem;  /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem;    /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem;  /* 24px */
--space-8: 2rem;    /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem;   /* 48px */
--space-16: 4rem;   /* 64px */
--space-20: 5rem;   /* 80px */
```

#### Component Examples

**Button**

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'primary' && 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2',
        size === 'lg' && 'px-6 py-3 text-lg',
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

**Card**

```typescript
const Card = ({ children, className }) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 dark:border-gray-800',
        'bg-white/80 dark:bg-gray-900/80',
        'backdrop-blur-sm',
        'shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
};
```

### Performance Considerations

1. **Code Splitting**: Use React.lazy for route-based splitting
2. **Memoization**: React.memo for expensive components
3. **Virtual Scrolling**: For large file lists
4. **Debounced Input**: For search and filters
5. **Web Workers**: For heavy AI processing
6. **IndexedDB**: For local file caching
7. **Service Workers**: For offline support

### Security Measures

1. **API Key Encryption**: Encrypt keys at rest
2. **CSP Headers**: Content Security Policy
3. **Input Sanitization**: XSS prevention
4. **Rate Limiting**: API request throttling
5. **OAuth Integration**: Secure authentication
6. **Dependency Scanning**: Automated vulnerability checks

## Conclusion

Bolt-Chef Unified will combine the best of both worlds:
- Bolt.diy's extensive AI provider ecosystem and developer tools
- Chef's reactive backend capabilities and Convex integration
- Modern UI/UX design inspired by bolt.new

The result will be a powerful, modern, full-stack web development tool that empowers developers to build applications faster than ever before.

---

*This document serves as the blueprint for building Bolt-Chef Unified - the next generation of AI-powered development tools.*
