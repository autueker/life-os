export function formatDate(date: Date): string {
	return date.toISOString().split('T')[0];
}

export function formatDisplayDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function isToday(dateStr: string): boolean {
	return dateStr === formatDate(new Date());
}

export function computeStreak(entries: { date: string; value: number }[]): {
	current: number;
	longest: number;
} {
	if (entries.length === 0) return { current: 0, longest: 0 };

	const dateSet = new Set(entries.filter((e) => e.value > 0).map((e) => e.date));

	let current = 0;
	let longest = 0;
	let streak = 0;

	// Walk backwards from today
	const today = new Date();
	const d = new Date(today);

	// Check if today is done — if not, start from yesterday
	if (!dateSet.has(formatDate(d))) {
		d.setDate(d.getDate() - 1);
	}

	// Count current streak
	while (dateSet.has(formatDate(d))) {
		current++;
		d.setDate(d.getDate() - 1);
	}

	// Compute longest streak by scanning all dates
	const sorted = [...dateSet].sort();
	for (let i = 0; i < sorted.length; i++) {
		if (i === 0) {
			streak = 1;
		} else {
			const prev = new Date(sorted[i - 1]);
			const curr = new Date(sorted[i]);
			const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
			streak = diffDays === 1 ? streak + 1 : 1;
		}
		longest = Math.max(longest, streak);
	}

	return { current, longest };
}
