import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { habitEntries, habits } from '$lib/server/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
	const from = url.searchParams.get('from');
	const to = url.searchParams.get('to');

	let query = db.select().from(habitEntries).where(eq(habitEntries.habitId, params.id));

	if (from && to) {
		query = db
			.select()
			.from(habitEntries)
			.where(
				and(
					eq(habitEntries.habitId, params.id),
					gte(habitEntries.date, from),
					lte(habitEntries.date, to)
				)
			);
	}

	const result = await query;
	return json({ data: result });
};

export const POST: RequestHandler = async ({ params, request }) => {
	const body = await request.json();

	// Verify habit exists
	const [habit] = await db.select().from(habits).where(eq(habits.id, params.id));
	if (!habit) throw error(404, 'Habit not found');

	const date = body.date;

	// Check if entry already exists for this date — if so, delete it (toggle behavior)
	const [existing] = await db
		.select()
		.from(habitEntries)
		.where(and(eq(habitEntries.habitId, params.id), eq(habitEntries.date, date)));

	if (existing) {
		await db.delete(habitEntries).where(eq(habitEntries.id, existing.id));
		return json({ data: null, toggled: 'off' });
	}

	const [entry] = await db
		.insert(habitEntries)
		.values({
			id: nanoid(),
			habitId: params.id,
			date,
			value: body.value ?? 1,
			note: body.note ?? ''
		})
		.returning();

	return json({ data: entry, toggled: 'on' }, { status: 201 });
};
