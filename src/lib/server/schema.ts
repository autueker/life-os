import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const habits = sqliteTable('habits', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').default(''),
	color: text('color').default('#6366f1'),
	icon: text('icon').default('activity'),
	frequency: text('frequency').default('daily'), // daily, weekly
	targetPerDay: integer('target_per_day').default(1),
	sortOrder: integer('sort_order').default(0),
	archived: integer('archived', { mode: 'boolean' }).default(false),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const habitEntries = sqliteTable(
	'habit_entries',
	{
		id: text('id').primaryKey(),
		habitId: text('habit_id')
			.notNull()
			.references(() => habits.id, { onDelete: 'cascade' }),
		date: text('date').notNull(), // YYYY-MM-DD
		value: real('value').default(1),
		note: text('note').default(''),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [uniqueIndex('habit_date_idx').on(table.habitId, table.date)]
);
