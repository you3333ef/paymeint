import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Folder, Plus, Search } from 'lucide-react';

export function FileManager() {
  const [files] = useState([
    { name: 'README.md', type: 'file', path: '/README.md' },
    { name: 'src', type: 'folder', path: '/src', children: [
      { name: 'App.tsx', type: 'file', path: '/src/App.tsx' },
      { name: 'main.tsx', type: 'file', path: '/src/main.tsx' },
    ]},
    { name: 'public', type: 'folder', path: '/public' },
    { name: 'package.json', type: 'file', path: '/package.json' },
    { name: 'vite.config.ts', type: 'file', path: '/vite.config.ts' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const renderTree = (items: any[], level = 0) => {
    return items.map((item, index) => {
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return null;
      }

      return (
        <div key={index} style={{ paddingLeft: level * 12 }}>
          <div className="flex items-center gap-2 rounded px-2 py-1 hover:bg-accent cursor-pointer">
            {item.type === 'folder' ? (
              <Folder className="h-4 w-4 text-blue-500" />
            ) : (
              <FileText className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">{item.name}</span>
          </div>
          {item.children && renderTree(item.children, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/40 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Files</h3>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {renderTree(files)}
      </div>
    </div>
  );
}
