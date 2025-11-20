import { v } from 'convex/values';
import { MutationCtx, QueryCtx } from './_generated/server';
import { getUserId } from './helpers';

export async function createDeployment(
  ctx: MutationCtx,
  projectId: string,
  platform: 'netlify' | 'vercel' | 'github-pages' | 'cloudflare'
) {
  const userId = await getUserId(ctx);
  if (!userId) throw new Error('Unauthorized');

  const now = Date.now();

  return await ctx.db.insert('deployments', {
    projectId,
    platform,
    url: '',
    status: 'pending',
    logs: ['Deployment started...'],
    createdAt: now,
    updatedAt: now,
  });
}

export async function getDeployments(ctx: QueryCtx, projectId: string) {
  return await ctx.db
    .query('deployments')
    .withIndex('by_project', (q) => q.eq('projectId', projectId))
    .order('desc')
    .collect();
}

export async function updateDeploymentStatus(
  ctx: MutationCtx,
  deploymentId: string,
  status: 'pending' | 'building' | 'deployed' | 'failed',
  url?: string
) {
  const deployment = await ctx.db.get(deploymentId);
  if (!deployment) throw new Error('Deployment not found');

  await ctx.db.patch(deploymentId, {
    status,
    url: url || deployment.url,
    updatedAt: Date.now(),
  });
}

export async function addDeploymentLog(
  ctx: MutationCtx,
  deploymentId: string,
  log: string
) {
  const deployment = await ctx.db.get(deploymentId);
  if (!deployment) throw new Error('Deployment not found');

  await ctx.db.patch(deploymentId, {
    logs: [...deployment.logs, log],
    updatedAt: Date.now(),
  });
}
