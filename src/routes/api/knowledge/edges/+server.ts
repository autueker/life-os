import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { knowledgeEdges } from '$lib/server/schema';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const result = await db.select().from(knowledgeEdges);
	return json({ data: result });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const id = nanoid();

	const [edge] = await db
		.insert(knowledgeEdges)
		.values({
			id,
			sourceId: body.sourceId,
			targetId: body.targetId,
			label: body.label ?? ''
		})
		.returning();

	return json({ data: edge }, { status: 201 });
};
