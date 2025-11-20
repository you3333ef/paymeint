import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Terminal, X, Play } from 'lucide-react';

interface TerminalOutput {
  id: string;
  content: string;
  type: 'command' | 'output';
}

export function TerminalPane() {
  const [outputs, setOutputs] = useState<TerminalOutput[]>([
    { id: '1', content: '$ npm run dev', type: 'command' },
    { id: '2', content: 'VITE v5.1.4  ready in 500 ms', type: 'output' },
    { id: '3', content: '➜  Local:   http://localhost:5173/', type: 'output' },
  ]);
  const [command, setCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setOutputs((prev) => [
      ...prev,
      { id: Date.now().toString(), content: `$ ${command}`, type: 'command' },
    ]);
    setCommand('');
  };

  return (
    <div className="flex h-64 flex-col bg-black">
      <div className="flex items-center justify-between border-b border-border/40 bg-card/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <Button variant="ghost" size="sm">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-sm text-green-400">
        {outputs.map((output) => (
          <div key={output.id} className="mb-1">
            <pre className="whitespace-pre-wrap">{output.content}</pre>
          </div>
        ))}
      </div>

      <div className="border-t border-border/40 p-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-sm text-green-400">$</span>
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-1 bg-black font-mono text-sm text-green-400"
            placeholder="Enter command..."
            autoFocus
          />
          <Button type="submit" size="icon">
            <Play className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
