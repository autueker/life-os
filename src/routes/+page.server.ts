import { db } from '$lib/server/db';
import { habits, habitEntries } from '$lib/server/schema';
import { eq, and, gte } from 'drizzle-orm';
import { computeStreak, formatDate } from '$lib/utils/dates';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allHabits = await db.select().from(habits).where(eq(habits.archived, false));

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

	const todayStr = formatDate(new Date());
	const completedToday = habitsWithEntries.filter((h) =>
		h.entries.some((e) => e.date === todayStr && (e.value ?? 0) > 0)
	).length;

	const bestActiveStreak = habitsWithEntries.reduce(
		(max, h) => Math.max(max, h.streak.current),
		0
	);

	return {
		habits: habitsWithEntries,
		completedToday,
		totalHabits: habitsWithEntries.length,
		bestActiveStreak
	};
};
