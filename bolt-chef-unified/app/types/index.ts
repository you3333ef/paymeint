export interface AIModel {
  id: string;
  name: string;
  contextLength: number;
  pricing: {
    input: number;
    output: number;
  };
}

export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  hasApiKey: boolean;
  isValidating?: boolean;
  lastValidated?: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
}

export interface ChatSession {
  id: string;
  projectId: string;
  title: string;
  provider: string;
  model: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  files: Record<string, string>;
  currentFile?: string;
  isRunning?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Deployment {
  id: string;
  projectId: string;
  platform: 'netlify' | 'vercel' | 'github-pages' | 'cloudflare';
  url: string;
  status: 'pending' | 'building' | 'deployed' | 'failed';
  logs: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FileLock {
  filePath: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface ProviderConfig {
  id: string;
  apiKey?: string;
  enabled: boolean;
  models: {
    default: string;
    available: string[];
  };
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
}

export interface AppSettings {
  theme: Theme;
  providers: Record<string, ProviderConfig>;
  editor: {
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
  };
  ai: {
    defaultProvider: string;
    defaultModel: string;
    maxTokens: number;
    temperature: number;
  };
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface PreviewPaneState {
  isOpen: boolean;
  width: number;
  refreshKey: number;
  errors: string[];
}

export interface EditorPaneState {
  activeFile: string | null;
  openFiles: string[];
  splitDirection: 'horizontal' | 'vertical';
}

export interface AppState {
  currentProject: Project | null;
  projects: Project[];
  currentChat: ChatSession | null;
  chats: ChatSession[];
  isLoading: boolean;
  error: string | null;
  settings: AppSettings;
}

export interface StreamResponse {
  content: string;
  done: boolean;
}

export type ProviderStatus = 'ready' | 'invalid' | 'validating' | 'disabled';

export interface ProviderValidationResult {
  isValid: boolean;
  error?: string;
}

export type FileChangeType = 'added' | 'modified' | 'deleted';

export interface FileChange {
  type: FileChangeType;
  path: string;
  content?: string;
}

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  changes: FileChange[];
}

export interface TerminalOutput {
  id: string;
  content: string;
  type: 'stdout' | 'stderr';
  timestamp: Date;
}

export interface TerminalSession {
  id: string;
  projectId: string;
  outputs: TerminalOutput[];
  isRunning: boolean;
  pid?: number;
}
