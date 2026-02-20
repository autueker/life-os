import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const result = await db.select().from(projects).where(eq(projects.archived, false));
	return json({ data: result });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const id = nanoid();

	const [project] = await db
		.insert(projects)
		.values({
			id,
			name: body.name,
			description: body.description ?? '',
			color: body.color ?? '#6366f1',
			icon: body.icon ?? 'folder',
			sortOrder: body.sortOrder ?? 0
		})
		.returning();

	return json({ data: project }, { status: 201 });
};
