import { streamText, StreamTextResult } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createXAI } from '@ai-sdk/xai';
import { ChatMessage } from '@/types';

export type ProviderName = 'openai' | 'anthropic' | 'google' | 'groq' | 'xai' | 'deepseek' | 'mistral' | 'cohere' | 'together' | 'perplexity' | 'huggingface' | 'openrouter' | 'ollama';

export interface AIProviderClient {
  name: string;
  streamChat: (messages: ChatMessage[]) => Promise<StreamTextResult>;
  countTokens: (text: string) => number;
}

export class OpenAIProvider implements AIProviderClient {
  name = 'openai';
  private client = createOpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('gpt-4o'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class AnthropicProvider implements AIProviderClient {
  name = 'anthropic';
  private client = createAnthropic({ apiKey: process.env.VITE_ANTHROPIC_API_KEY });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('claude-3-5-sonnet-20241022'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class GoogleProvider implements AIProviderClient {
  name = 'google';
  private client = createGoogleGenerativeAI({ apiKey: process.env.VITE_GOOGLE_API_KEY });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('gemini-1.5-pro'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class GroqProvider implements AIProviderClient {
  name = 'groq';
  private client = createOpenAI({
    apiKey: process.env.VITE_GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
  });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('llama-3.1-70b-versatile'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class XAIProvider implements AIProviderClient {
  name = 'xai';
  private client = createXAI({
    apiKey: process.env.VITE_XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1'
  });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('grok-beta'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class DeepSeekProvider implements AIProviderClient {
  name = 'deepseek';
  private client = createOpenAI({
    apiKey: process.env.VITE_DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1'
  });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('deepseek-coder'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class MistralProvider implements AIProviderClient {
  name = 'mistral';
  private client = createOpenAI({
    apiKey: process.env.VITE_MISTRAL_API_KEY,
    baseURL: 'https://api.mistral.ai/v1'
  });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('mistral-large-latest'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class CohereProvider implements AIProviderClient {
  name = 'cohere';
  private client = createOpenAI({
    apiKey: process.env.VITE_COHERE_API_KEY,
    baseURL: 'https://api.cohere.ai/v1'
  });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('command-r'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class TogetherProvider implements AIProviderClient {
  name = 'together';
  private client = createOpenAI({
    apiKey: process.env.VITE_TOGETHER_API_KEY,
    baseURL: 'https://api.together.xyz/v1'
  });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('meta-llama/Llama-3.1-70B-Instruct-Turbo'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class PerplexityProvider implements AIProviderClient {
  name = 'perplexity';
  private client = createOpenAI({
    apiKey: process.env.VITE_PERPLEXITY_API_KEY,
    baseURL: 'https://api.perplexity.ai'
  });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('sonar'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class HuggingFaceProvider implements AIProviderClient {
  name = 'huggingface';
  private client = createOpenAI({
    apiKey: process.env.VITE_HF_API_KEY,
    baseURL: 'https://api-inference.huggingface.co/models'
  });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('meta-llama/Llama-3.1-70B-Instruct'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class OpenRouterProvider implements AIProviderClient {
  name = 'openrouter';
  private client = createOpenAI({
    apiKey: process.env.VITE_OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
  });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('anthropic/claude-3.5-sonnet'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export class OllamaProvider implements AIProviderClient {
  name = 'ollama';
  private client = createOpenAI({
    apiKey: 'ollama',
    baseURL: 'http://localhost:11434/v1'
  });

  async streamChat(messages: ChatMessage[]) {
    return streamText({
      model: this.client('llama3.1'),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    });
  }

  countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export const getAIProvider = (providerName: ProviderName): AIProviderClient => {
  const providers: Record<ProviderName, AIProviderClient> = {
    openai: new OpenAIProvider(),
    anthropic: new AnthropicProvider(),
    google: new GoogleProvider(),
    groq: new GroqProvider(),
    xai: new XAIProvider(),
    deepseek: new DeepSeekProvider(),
    mistral: new MistralProvider(),
    cohere: new CohereProvider(),
    together: new TogetherProvider(),
    perplexity: new PerplexityProvider(),
    huggingface: new HuggingFaceProvider(),
    openrouter: new OpenRouterProvider(),
    ollama: new OllamaProvider(),
  };

  return providers[providerName];
};
