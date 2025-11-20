import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Play, Save, Folder } from 'lucide-react';

export function EditorPane() {
  const [code, setCode] = useState(
    `// Welcome to Bolt-Chef Unified!

function Welcome() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold gradient-text mb-4">
        Hello, World!
      </h1>
      <p className="text-muted-foreground">
        Start building your application here.
      </p>
    </div>
  );
}

export default Welcome;
`
  );
  const [language, setLanguage] = useState('typescript');

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border/40 bg-card/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">src/App.tsx</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button size="sm">
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            tabSize: 2,
            wordWrap: 'on',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'all',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
}
