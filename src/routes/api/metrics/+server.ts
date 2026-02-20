import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { metrics } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const result = await db.select().from(metrics).where(eq(metrics.archived, false));
	return json({ data: result });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const id = nanoid();

	const [metric] = await db
		.insert(metrics)
		.values({
			id,
			name: body.name,
			description: body.description ?? '',
			unit: body.unit ?? '',
			color: body.color ?? '#6366f1',
			type: body.type ?? 'number',
			targetValue: body.targetValue ?? null,
			sortOrder: body.sortOrder ?? 0
		})
		.returning();

	return json({ data: metric }, { status: 201 });
};
