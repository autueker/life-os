import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { knowledgeEdges } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
	const deleted = await db
		.delete(knowledgeEdges)
		.where(eq(knowledgeEdges.id, params.id))
		.returning();

	if (deleted.length === 0) throw error(404, 'Edge not found');
	return json({ data: deleted[0] });
};
