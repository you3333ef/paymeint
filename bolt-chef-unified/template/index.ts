export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  files: Record<string, string>;
  scripts: {
    dev: string;
    build: string;
    preview: string;
  };
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export const templates: ProjectTemplate[] = [
  {
    id: 'react-vite',
    name: 'React + Vite',
    description: 'React application with Vite, TypeScript, and Tailwind CSS',
    tags: ['react', 'typescript', 'vite', 'tailwind'],
    files: {
      'src/App.tsx': `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>React App</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}

export default App`,
      'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,
      'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@vitejs/plugin-react': '^4.0.0',
      typescript: '^5.0.2',
      vite: '^4.4.5',
      tailwindcss: '^3.3.0',
      autoprefixer: '^10.4.14',
      postcss: '^8.4.24',
    },
  },
  {
    id: 'next-app',
    name: 'Next.js',
    description: 'Full-stack React framework with SSR and API routes',
    tags: ['react', 'nextjs', 'typescript', 'api'],
    files: {
      'app/page.tsx': `export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js</h1>
    </main>
  )
}`,
      'app/layout.tsx': `export const metadata = {
    title: 'Next.js App',
  }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
    },
    scripts: {
      dev: 'next dev',
      build: 'next build',
      preview: 'next preview',
    },
    dependencies: {
      next: 'latest',
      react: 'latest',
      'react-dom': 'latest',
    },
  },
  {
    id: 'node-express',
    name: 'Node.js + Express',
    description: 'Backend API with Express.js and TypeScript',
    tags: ['node', 'express', 'typescript', 'api'],
    files: {
      'src/index.ts': `import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`,
    },
    scripts: {
      dev: 'ts-node-dev src/index.ts',
      build: 'tsc',
      preview: 'node dist/index.js',
    },
    dependencies: {
      express: '^4.18.2',
      cors: '^2.8.5',
    },
    devDependencies: {
      '@types/express': '^4.17.17',
      '@types/cors': '^2.8.13',
      'ts-node-dev': '^2.0.0',
      typescript: '^5.0.2',
    },
  },
];

export const getTemplate = (id: string): ProjectTemplate | undefined => {
  return templates.find(t => t.id === id);
};

export const getAllTemplates = (): ProjectTemplate[] => {
  return templates;
};

export const getTemplatesByTag = (tag: string): ProjectTemplate[] => {
  return templates.filter(t => t.tags.includes(tag));
};
