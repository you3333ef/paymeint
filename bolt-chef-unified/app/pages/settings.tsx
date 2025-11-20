import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AIProviderSettings } from '@/components/settings/ai-provider-settings';
import { GeneralSettings } from '@/components/settings/general-settings';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'providers'>('providers');

  return (
    <div className="container mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your AI providers, editor preferences, and more
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-0">
              <button
                onClick={() => setActiveTab('providers')}
                className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                  activeTab === 'providers'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                AI Providers
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                  activeTab === 'general'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                General
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'providers' && (
            <Card>
              <CardHeader>
                <CardTitle>AI Providers</CardTitle>
                <CardDescription>
                  Configure your AI provider API keys and models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIProviderSettings />
              </CardContent>
            </Card>
          )}

          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your editor, theme, and other preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GeneralSettings />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
