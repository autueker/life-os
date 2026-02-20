import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tasks } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const projectId = url.searchParams.get('projectId');

	let result;
	if (projectId) {
		result = await db
			.select()
			.from(tasks)
			.where(and(eq(tasks.archived, false), eq(tasks.projectId, projectId)));
	} else {
		result = await db.select().from(tasks).where(eq(tasks.archived, false));
	}

	return json({ data: result });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const id = nanoid();

	const [task] = await db
		.insert(tasks)
		.values({
			id,
			title: body.title,
			description: body.description ?? '',
			status: body.status ?? 'todo',
			priority: body.priority ?? 'medium',
			projectId: body.projectId ?? null,
			dueDate: body.dueDate ?? null,
			sortOrder: body.sortOrder ?? 0
		})
		.returning();

	return json({ data: task }, { status: 201 });
};
