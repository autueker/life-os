import { db } from '$lib/server/db';
import { habits, habitEntries } from '$lib/server/schema';
import { eq, and, gte } from 'drizzle-orm';
import { computeStreak, formatDate } from '$lib/utils/dates';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allHabits = await db.select().from(habits).where(eq(habits.archived, false));

	// Get entries from the last 365 days
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
	const fromDate = formatDate(oneYearAgo);

	const habitsWithEntries = await Promise.all(
		allHabits.map(async (habit) => {
			const entries = await db
				.select()
				.from(habitEntries)
				.where(
					and(eq(habitEntries.habitId, habit.id), gte(habitEntries.date, fromDate))
				);

			const streak = computeStreak(entries.map((e) => ({ date: e.date, value: e.value ?? 0 })));

			return {
				...habit,
				entries,
				streak
			};
		})
	);

	return { habits: habitsWithEntries };
};
