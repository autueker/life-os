import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { knowledgeNodes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json();

	const [updated] = await db
		.update(knowledgeNodes)
		.set({
			...body,
			updatedAt: new Date().toISOString()
		})
		.where(eq(knowledgeNodes.id, params.id))
		.returning();

	if (!updated) throw error(404, 'Node not found');
	return json({ data: updated });
};

export const DELETE: RequestHandler = async ({ params }) => {
	const [updated] = await db
		.update(knowledgeNodes)
		.set({ archived: true, updatedAt: new Date().toISOString() })
		.where(eq(knowledgeNodes.id, params.id))
		.returning();

	if (!updated) throw error(404, 'Node not found');
	return json({ data: updated });
};
