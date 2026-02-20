import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { habits } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const result = await db.select().from(habits).where(eq(habits.archived, false));
	return json({ data: result });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const id = nanoid();

	const [habit] = await db
		.insert(habits)
		.values({
			id,
			name: body.name,
			description: body.description ?? '',
			color: body.color ?? '#6366f1',
			icon: body.icon ?? 'activity',
			frequency: body.frequency ?? 'daily',
			targetPerDay: body.targetPerDay ?? 1,
			sortOrder: body.sortOrder ?? 0
		})
		.returning();

	return json({ data: habit }, { status: 201 });
};
