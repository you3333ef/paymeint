import { v } from 'convex/values';
import { MutationCtx, QueryCtx } from './_generated/server';
import { getUserId } from './helpers';

export async function createChat(
  ctx: MutationCtx,
  projectId: string,
  provider: string,
  model: string
) {
  const userId = await getUserId(ctx);
  if (!userId) throw new Error('Unauthorized');

  const now = Date.now();

  return await ctx.db.insert('chats', {
    projectId,
    title: 'New Chat',
    provider,
    model,
    messages: [],
    createdAt: now,
    updatedAt: now,
  });
}

export async function getChats(ctx: QueryCtx, projectId: string) {
  const userId = await getUserId(ctx);
  if (!userId) throw new Error('Unauthorized');

  return await ctx.db
    .query('chats')
    .withIndex('by_project', (q) => q.eq('projectId', projectId))
    .order('desc')
    .collect();
}

export async function addMessage(
  ctx: MutationCtx,
  chatId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
) {
  const chat = await ctx.db.get(chatId);
  if (!chat) throw new Error('Chat not found');

  const message = {
    role,
    content,
    timestamp: Date.now(),
  };

  await ctx.db.patch(chatId, {
    messages: [...chat.messages, message],
    updatedAt: Date.now(),
  });
}

export async function getChat(ctx: QueryCtx, chatId: string) {
  const chat = await ctx.db.get(chatId);
  if (!chat) throw new Error('Chat not found');

  return chat;
}
