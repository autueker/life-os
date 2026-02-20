import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { knowledgeNodes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const result = await db
		.select()
		.from(knowledgeNodes)
		.where(eq(knowledgeNodes.archived, false));
	return json({ data: result });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const id = nanoid();

	const [node] = await db
		.insert(knowledgeNodes)
		.values({
			id,
			title: body.title,
			content: body.content ?? '',
			type: body.type ?? 'note',
			color: body.color ?? '#6366f1',
			x: body.x ?? Math.random() * 800,
			y: body.y ?? Math.random() * 600
		})
		.returning();

	return json({ data: node }, { status: 201 });
};
