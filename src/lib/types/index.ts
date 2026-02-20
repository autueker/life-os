export interface Habit {
	id: string;
	name: string;
	description: string;
	color: string;
	icon: string;
	frequency: string;
	targetPerDay: number;
	sortOrder: number;
	archived: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface HabitEntry {
	id: string;
	habitId: string;
	date: string;
	value: number;
	note: string;
	createdAt: string;
}

export interface HabitWithEntries extends Habit {
	entries: HabitEntry[];
	streak: { current: number; longest: number };
}
