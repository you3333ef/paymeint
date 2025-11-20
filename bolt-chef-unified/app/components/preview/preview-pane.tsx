import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, Maximize2, RotateCcw } from 'lucide-react';

export function PreviewPane() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border/40 bg-card/50 px-4 py-2">
        <h3 className="text-sm font-medium">Preview</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-background">
        <div className="flex h-full items-center justify-center">
          <Card className="glass m-8 w-full max-w-4xl p-8 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <RefreshCw className={`h-6 w-6 text-primary ${isLoading ? 'animate-spin' : ''}`} />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Preview Ready</h2>
            <p className="text-muted-foreground">
              Your application will appear here. Click "Run" to start the preview server.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
