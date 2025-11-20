import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_createdAt', ['createdAt']),

  projects: defineTable({
    userId: v.id('users'),
    name: v.string(),
    description: v.optional(v.string()),
    files: v.record(v.string(), v.string()),
    isRunning: v.boolean(),
    currentFile: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_createdAt', ['userId', 'createdAt']),

  chats: defineTable({
    projectId: v.id('projects'),
    title: v.string(),
    provider: v.string(),
    model: v.string(),
    messages: v.array(v.object({
      role: v.union(v.literal('user'), v.literal('assistant'), v.literal('system')),
      content: v.string(),
      timestamp: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_project_updatedAt', ['projectId', 'updatedAt']),

  deployments: defineTable({
    projectId: v.id('projects'),
    platform: v.union(
      v.literal('netlify'),
      v.literal('vercel'),
      v.literal('github-pages'),
      v.literal('cloudflare')
    ),
    url: v.string(),
    status: v.union(
      v.literal('pending'),
      v.literal('building'),
      v.literal('deployed'),
      v.literal('failed')
    ),
    logs: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_status', ['status']),

  fileLocks: defineTable({
    projectId: v.id('projects'),
    filePath: v.string(),
    userId: v.id('users'),
    userName: v.string(),
    timestamp: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_file', ['projectId', 'filePath']),

  userSettings: defineTable({
    userId: v.id('users'),
    theme: v.union(v.literal('light'), v.literal('dark'), v.literal('system')),
    providers: v.record(v.string(), v.object({
      apiKey: v.optional(v.string()),
      enabled: v.boolean(),
      models: v.object({
        default: v.string(),
        available: v.array(v.string()),
      }),
    })),
    editor: v.object({
      fontSize: v.number(),
      tabSize: v.number(),
      wordWrap: v.boolean(),
      minimap: v.boolean(),
    }),
    ai: v.object({
      defaultProvider: v.string(),
      defaultModel: v.string(),
      maxTokens: v.number(),
      temperature: v.number(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId']),
});
