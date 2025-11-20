import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', hasApiKey: false },
  { id: 'anthropic', name: 'Anthropic', hasApiKey: false },
  { id: 'google', name: 'Google', hasApiKey: false },
  { id: 'groq', name: 'Groq', hasApiKey: false },
  { id: 'xai', name: 'xAI', hasApiKey: false },
];

export function AIProviderSettings() {
  const [providers, setProviders] = useState(PROVIDERS);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  const handleApiKeyChange = (providerId: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [providerId]: value }));
  };

  const handleToggle = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, hasApiKey: !p.hasApiKey } : p
      )
    );
  };

  const handleValidate = async (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, isValidating: true } : p
      )
    );

    setTimeout(() => {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId ? { ...p, isValidating: false, hasApiKey: true } : p
        )
      );
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {providers.map((provider) => (
        <Card key={provider.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{provider.name}</CardTitle>
                <CardDescription>Configure your {provider.name} API key</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {provider.hasApiKey ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Switch
                  checked={provider.hasApiKey}
                  onCheckedChange={() => handleToggle(provider.id)}
                />
              </div>
            </div>
          </CardHeader>
          {provider.hasApiKey && (
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter API key..."
                  value={apiKeys[provider.id] || ''}
                  onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => handleValidate(provider.id)}
                  disabled={provider.isValidating}
                >
                  {provider.isValidating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Validate'
                  )}
                </Button>
              </div>
              {provider.isValidating && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Validating API key...
                </p>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
