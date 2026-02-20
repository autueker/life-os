import { db } from '$lib/server/db';
import { tasks, projects } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allTasks = await db
		.select()
		.from(tasks)
		.where(eq(tasks.archived, false))
		.orderBy(asc(tasks.sortOrder));

	const allProjects = await db
		.select()
		.from(projects)
		.where(eq(projects.archived, false))
		.orderBy(asc(projects.sortOrder));

	const projectsWithProgress = allProjects.map((project) => {
		const projectTasks = allTasks.filter((t) => t.projectId === project.id);
		const total = projectTasks.length;
		const done = projectTasks.filter((t) => t.status === 'done').length;
		return {
			...project,
			tasks: projectTasks,
			progress: {
				total,
				done,
				percentage: total > 0 ? Math.round((done / total) * 100) : 0
			}
		};
	});

	return { tasks: allTasks, projects: projectsWithProgress };
};
