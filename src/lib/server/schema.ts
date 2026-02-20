import { sqliteTable, text, integer, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

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

export const projects = sqliteTable('projects', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').default(''),
	color: text('color').default('#6366f1'),
	icon: text('icon').default('folder'),
	sortOrder: integer('sort_order').default(0),
	archived: integer('archived', { mode: 'boolean' }).default(false),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const tasks = sqliteTable(
	'tasks',
	{
		id: text('id').primaryKey(),
		title: text('title').notNull(),
		description: text('description').default(''),
		status: text('status').default('todo'), // backlog, todo, in_progress, done
		priority: text('priority').default('medium'), // low, medium, high, urgent
		projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
		dueDate: text('due_date'), // YYYY-MM-DD, nullable
		sortOrder: integer('sort_order').default(0),
		archived: integer('archived', { mode: 'boolean' }).default(false),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		updatedAt: text('updated_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [index('task_project_idx').on(table.projectId)]
);

export const metrics = sqliteTable('metrics', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').default(''),
	unit: text('unit').default(''), // e.g. "kg", "hours", "%", ""
	color: text('color').default('#6366f1'),
	type: text('type').default('number'), // number, percentage, duration, boolean
	targetValue: real('target_value'),
	sortOrder: integer('sort_order').default(0),
	archived: integer('archived', { mode: 'boolean' }).default(false),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const metricEntries = sqliteTable(
	'metric_entries',
	{
		id: text('id').primaryKey(),
		metricId: text('metric_id')
			.notNull()
			.references(() => metrics.id, { onDelete: 'cascade' }),
		date: text('date').notNull(), // YYYY-MM-DD
		value: real('value').notNull(),
		note: text('note').default(''),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [uniqueIndex('metric_date_idx').on(table.metricId, table.date)]
);

export const knowledgeNodes = sqliteTable('knowledge_nodes', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	content: text('content').default(''),
	type: text('type').default('note'), // note, concept, resource
	color: text('color').default('#6366f1'),
	x: real('x').default(0),
	y: real('y').default(0),
	archived: integer('archived', { mode: 'boolean' }).default(false),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const knowledgeEdges = sqliteTable(
	'knowledge_edges',
	{
		id: text('id').primaryKey(),
		sourceId: text('source_id')
			.notNull()
			.references(() => knowledgeNodes.id, { onDelete: 'cascade' }),
		targetId: text('target_id')
			.notNull()
			.references(() => knowledgeNodes.id, { onDelete: 'cascade' }),
		label: text('label').default(''),
		createdAt: text('created_at')
			.notNull()
			.$defaultFn(() => new Date().toISOString())
	},
	(table) => [
		index('edge_source_idx').on(table.sourceId),
		index('edge_target_idx').on(table.targetId)
	]
);
