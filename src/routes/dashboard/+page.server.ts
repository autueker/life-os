import { db } from '$lib/server/db';
import { habits, habitEntries, tasks, metrics, metricEntries } from '$lib/server/schema';
import { eq, and, gte, asc } from 'drizzle-orm';
import { formatDate } from '$lib/utils/dates';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Habits summary
	const allHabits = await db.select().from(habits).where(eq(habits.archived, false));

	const todayStr = formatDate(new Date());
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const fromDate30 = formatDate(thirtyDaysAgo);

	const recentEntries = await db
		.select()
		.from(habitEntries)
		.where(gte(habitEntries.date, fromDate30));

	// Habit completion rate per day (last 30 days)
	const habitCompletionByDay: { date: string; rate: number }[] = [];
	if (allHabits.length > 0) {
		for (let i = 29; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const ds = formatDate(d);
			const completed = recentEntries.filter((e) => e.date === ds && (e.value ?? 0) > 0).length;
			habitCompletionByDay.push({
				date: ds,
				rate: Math.round((completed / allHabits.length) * 100)
			});
		}
	}

	const completedToday = recentEntries.filter(
		(e) => e.date === todayStr && (e.value ?? 0) > 0
	).length;

	// Tasks summary
	const allTasks = await db.select().from(tasks).where(eq(tasks.archived, false));
	const tasksByStatus = {
		backlog: allTasks.filter((t) => t.status === 'backlog').length,
		todo: allTasks.filter((t) => t.status === 'todo').length,
		in_progress: allTasks.filter((t) => t.status === 'in_progress').length,
		done: allTasks.filter((t) => t.status === 'done').length
	};

	// Metrics with entries (last 30 days)
	const allMetrics = await db
		.select()
		.from(metrics)
		.where(eq(metrics.archived, false))
		.orderBy(asc(metrics.sortOrder));

	const metricsWithEntries = await Promise.all(
		allMetrics.map(async (metric) => {
			const entries = await db
				.select()
				.from(metricEntries)
				.where(
					and(eq(metricEntries.metricId, metric.id), gte(metricEntries.date, fromDate30))
				)
				.orderBy(asc(metricEntries.date));

			const latest = entries.length > 0 ? entries[entries.length - 1].value : null;

			// Trend: compare last 7 days average vs previous 7 days
			let trend: number | null = null;
			const sevenDaysAgo = new Date();
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
			const fourteenDaysAgo = new Date();
			fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
			const s7 = formatDate(sevenDaysAgo);
			const s14 = formatDate(fourteenDaysAgo);

			const recent7 = entries.filter((e) => e.date >= s7);
			const prev7 = entries.filter((e) => e.date >= s14 && e.date < s7);
			if (recent7.length > 0 && prev7.length > 0) {
				const avgRecent = recent7.reduce((s, e) => s + e.value, 0) / recent7.length;
				const avgPrev = prev7.reduce((s, e) => s + e.value, 0) / prev7.length;
				if (avgPrev !== 0) {
					trend = ((avgRecent - avgPrev) / Math.abs(avgPrev)) * 100;
				}
			}

			return { ...metric, entries, latest, trend };
		})
	);

	return {
		habitCount: allHabits.length,
		completedToday,
		habitCompletionByDay,
		tasksByStatus,
		totalTasks: allTasks.length,
		metrics: metricsWithEntries
	};
};
