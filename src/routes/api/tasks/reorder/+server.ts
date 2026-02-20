import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tasks } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const items: { id: string; status: string; sortOrder: number }[] = body.tasks;

	for (const item of items) {
		await db
			.update(tasks)
			.set({
				status: item.status,
				sortOrder: item.sortOrder,
				updatedAt: new Date().toISOString()
			})
			.where(eq(tasks.id, item.id));
	}

	return json({ data: { updated: items.length } });
};
