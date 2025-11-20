import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Folder,
  Plus,
  FileText,
  Settings,
  Home,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Project } from '@/types';

export function Sidebar() {
  const navigate = useNavigate();
  const [projects] = useState<Project[]>([]);

  return (
    <div className="hidden w-64 border-r border-border/40 bg-card/50 backdrop-blur-sm md:block">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border/40 p-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 justify-start gap-2"
            onClick={() => navigate('/editor')}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm font-medium text-muted-foreground"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Recent Projects
              </h3>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <Folder className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No projects yet
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate('/editor')}
                >
                  Create your first project
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="cursor-pointer p-3 hover:border-primary/50"
                    onClick={() => navigate(`/editor/${project.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-4 w-4 flex-shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {project.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {project.description || 'No description'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border/40 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
