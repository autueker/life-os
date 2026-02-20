import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { metricEntries } from '$lib/server/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
	const from = url.searchParams.get('from');
	const to = url.searchParams.get('to');

	const conditions = [eq(metricEntries.metricId, params.id)];
	if (from) conditions.push(gte(metricEntries.date, from));
	if (to) conditions.push(lte(metricEntries.date, to));

	const result = await db
		.select()
		.from(metricEntries)
		.where(and(...conditions));

	return json({ data: result });
};

export const POST: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const id = nanoid();

	// Upsert: delete existing entry for this date, then insert
	await db
		.delete(metricEntries)
		.where(
			and(eq(metricEntries.metricId, params.id), eq(metricEntries.date, body.date))
		);

	const [entry] = await db
		.insert(metricEntries)
		.values({
			id,
			metricId: params.id,
			date: body.date,
			value: body.value,
			note: body.note ?? ''
		})
		.returning();

	return json({ data: entry }, { status: 201 });
};
