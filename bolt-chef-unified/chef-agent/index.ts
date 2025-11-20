import { getAIProvider } from '../app/lib/ai';
import { ChatMessage } from '../app/types';

export type AgentState = 'idle' | 'thinking' | 'acting' | 'observing' | 'error';

export interface AgentLoopOptions {
  maxIterations?: number;
  provider?: string;
  model?: string;
  temperature?: number;
}

export interface LoopResult {
  success: boolean;
  iterations: number;
  finalState: AgentState;
  output?: any;
  error?: string;
}

export class ChefAgentLoop {
  private state: AgentState = 'idle';
  private iterations: number = 0;
  private maxIterations: number;
  private provider: string;
  private model: string;
  private temperature: number;

  constructor(options: AgentLoopOptions = {}) {
    this.maxIterations = options.maxIterations || 10;
    this.provider = options.provider || 'openai';
    this.model = options.model || 'gpt-4o';
    this.temperature = options.temperature || 0.7;
  }

  async run(
    systemPrompt: string,
    userPrompt: string,
    onIteration?: (iteration: number, state: AgentState, action: string) => void
  ): Promise<LoopResult> {
    try {
      this.state = 'thinking';
      this.iterations = 0;

      const messages: ChatMessage[] = [
        { id: '1', role: 'system', content: systemPrompt, timestamp: new Date() },
        { id: '2', role: 'user', content: userPrompt, timestamp: new Date() },
      ];

      const aiProvider = getAIProvider(this.provider as any);

      for (let i = 0; i < this.maxIterations; i++) {
        this.iterations = i + 1;
        onIteration?.(this.iterations, this.state, 'thinking');

        this.state = 'acting';
        onIteration?.(this.iterations, this.state, 'acting');

        const stream = await aiProvider.streamChat(messages);
        let assistantMessage = '';

        for await (const chunk of stream) {
          if (chunk.text) {
            assistantMessage += chunk.text;
            onIteration?.(this.iterations, this.state, 'streaming');
          }
        }

        this.state = 'observing';
        onIteration?.(this.iterations, this.state, 'observing');

        messages.push({
          id: `${this.iterations + 2}`,
          role: 'assistant',
          content: assistantMessage,
          timestamp: new Date(),
          provider: this.provider,
          model: this.model,
        });

        if (assistantMessage.includes('[DONE]') || assistantMessage.includes('[FINISH]')) {
          this.state = 'idle';
          return {
            success: true,
            iterations: this.iterations,
            finalState: 'idle',
            output: {
              messages,
              finalResponse: assistantMessage,
            },
          };
        }

        this.state = 'thinking';
      }

      this.state = 'error';
      return {
        success: false,
        iterations: this.iterations,
        finalState: 'error',
        error: 'Maximum iterations reached without completion',
      };
    } catch (error: any) {
      this.state = 'error';
      return {
        success: false,
        iterations: this.iterations,
        finalState: 'error',
        error: error.message,
      };
    }
  }

  getState(): AgentState {
    return this.state;
  }

  getIterations(): number {
    return this.iterations;
  }
}

export const createAgentLoop = (options?: AgentLoopOptions): ChefAgentLoop => {
  return new ChefAgentLoop(options);
};

export const DEFAULT_SYSTEM_PROMPT = `
You are Chef, an AI-powered full-stack development assistant.

Your capabilities:
- Build complete web applications (frontend + backend)
- Create databases and schemas
- Implement authentication and authorization
- Set up APIs and serverless functions
- Deploy to various platforms
- Write tests and documentation

When working:
1. Always think through the problem systematically
2. Break complex tasks into smaller steps
3. Provide working, production-ready code
4. Explain your reasoning and decisions
5. Use best practices and modern patterns

Output format:
- [ACTION] Describe what you're going to do
- [CODE] Show the code you want to implement
- [EXPLANATION] Explain why you made certain choices
- [DONE] When complete

Return [DONE] when the task is fully complete.
`;
