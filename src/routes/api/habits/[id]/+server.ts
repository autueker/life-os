import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { habits } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json();

	const [updated] = await db
		.update(habits)
		.set({
			...body,
			updatedAt: new Date().toISOString()
		})
		.where(eq(habits.id, params.id))
		.returning();

	if (!updated) throw error(404, 'Habit not found');
	return json({ data: updated });
};

export const DELETE: RequestHandler = async ({ params }) => {
	const [updated] = await db
		.update(habits)
		.set({ archived: true, updatedAt: new Date().toISOString() })
		.where(eq(habits.id, params.id))
		.returning();

	if (!updated) throw error(404, 'Habit not found');
	return json({ data: updated });
};
