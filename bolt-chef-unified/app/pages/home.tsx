import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Code, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          AI-Powered Full-Stack Development
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          Welcome to{' '}
          <span className="gradient-text">Bolt-Chef Unified</span>
        </h1>

        <p className="mb-8 text-xl text-muted-foreground">
          The next generation of AI-powered development tools. Build full-stack
          applications with reactive backends, multiple AI providers, and modern
          design.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => navigate('/editor')}
          >
            <Zap className="h-5 w-5" />
            Start Building
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/settings')}
          >
            Configure Providers
          </Button>
        </div>
      </div>

      <div className="mt-16 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader>
            <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>19+ AI Providers</CardTitle>
            <CardDescription>
              OpenAI, Anthropic, Google, Groq, xAI, DeepSeek, Mistral, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Real-time API key validation</li>
              <li>• Multi-model support</li>
              <li>• Cost tracking</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Reactive Backend</CardTitle>
            <CardDescription>
              Powered by Convex with real-time database and serverless APIs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Real-time updates</li>
              <li>• Built-in authentication</li>
              <li>• Background workflows</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Modern Design</CardTitle>
            <CardDescription>
              Beautiful UI inspired by bolt.new with dark/light themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Split-pane editor</li>
              <li>• Live preview</li>
              <li>• Smooth animations</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 w-full max-w-4xl">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>
              Get up and running in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </div>
                  <span className="font-medium">Configure AI Providers</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add your API keys for your preferred AI providers
                </p>
              </div>
              <div className="rounded-lg border border-border/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    2
                  </div>
                  <span className="font-medium">Create Project</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Start a new project or continue an existing one
                </p>
              </div>
              <div className="rounded-lg border border-border/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    3
                  </div>
                  <span className="font-medium">Build & Deploy</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Deploy to Netlify, Vercel, or other platforms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
