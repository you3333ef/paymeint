import { v } from 'convex/values';
import { MutationCtx, QueryCtx } from './_generated/server';
import { getUserId } from './helpers';

export async function acquireFileLock(
  ctx: MutationCtx,
  projectId: string,
  filePath: string,
  userName: string
) {
  const userId = await getUserId(ctx);
  if (!userId) throw new Error('Unauthorized');

  const now = Date.now();

  const existingLock = await ctx.db
    .query('fileLocks')
    .withIndex('by_file', (q) => q.eq('projectId', projectId).eq('filePath', filePath))
    .unique();

  if (existingLock) {
    throw new Error('File is already locked by another user');
  }

  return await ctx.db.insert('fileLocks', {
    projectId,
    filePath,
    userId,
    userName,
    timestamp: now,
  });
}

export async function releaseFileLock(
  ctx: MutationCtx,
  projectId: string,
  filePath: string
) {
  const userId = await getUserId(ctx);
  if (!userId) throw new Error('Unauthorized');

  const existingLock = await ctx.db
    .query('fileLocks')
    .withIndex('by_file', (q) => q.eq('projectId', projectId).eq('filePath', filePath))
    .unique();

  if (!existingLock) {
    throw new Error('No lock found for this file');
  }

  if (existingLock.userId !== userId) {
    throw new Error('You do not own this lock');
  }

  await ctx.db.delete(existingLock._id);
}

export async function getFileLocks(ctx: QueryCtx, projectId: string) {
  return await ctx.db
    .query('fileLocks')
    .withIndex('by_project', (q) => q.eq('projectId', projectId))
    .collect();
}

export async function forceReleaseLock(
  ctx: MutationCtx,
  projectId: string,
  filePath: string,
  userId: string
) {
  const existingLock = await ctx.db
    .query('fileLocks')
    .withIndex('by_file', (q) => q.eq('projectId', projectId).eq('filePath', filePath))
    .unique();

  if (!existingLock) {
    throw new Error('No lock found for this file');
  }

  await ctx.db.delete(existingLock._id);
}
