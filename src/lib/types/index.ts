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

// Tasks & Projects

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
	id: string;
	name: string;
	description: string;
	color: string;
	icon: string;
	sortOrder: number;
	archived: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	priority: TaskPriority;
	projectId: string | null;
	dueDate: string | null;
	sortOrder: number;
	archived: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ProjectWithTasks extends Project {
	tasks: Task[];
	progress: { total: number; done: number; percentage: number };
}

export const TASK_STATUSES: { value: TaskStatus; label: string; color: string }[] = [
	{ value: 'backlog', label: 'Backlog', color: '#6b7280' },
	{ value: 'todo', label: 'To Do', color: '#3b82f6' },
	{ value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
	{ value: 'done', label: 'Done', color: '#10b981' }
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
	{ value: 'low', label: 'Low', color: '#6b7280' },
	{ value: 'medium', label: 'Medium', color: '#3b82f6' },
	{ value: 'high', label: 'High', color: '#f59e0b' },
	{ value: 'urgent', label: 'Urgent', color: '#ef4444' }
];

// Metrics (Phase 4)

export type MetricType = 'number' | 'percentage' | 'duration' | 'boolean';

export interface Metric {
	id: string;
	name: string;
	description: string;
	unit: string;
	color: string;
	type: MetricType;
	targetValue: number | null;
	sortOrder: number;
	archived: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface MetricEntry {
	id: string;
	metricId: string;
	date: string;
	value: number;
	note: string;
	createdAt: string;
}

export interface MetricWithEntries extends Metric {
	entries: MetricEntry[];
	latest: number | null;
	trend: number | null; // percentage change over last 7 days
}

export const METRIC_TYPES: { value: MetricType; label: string }[] = [
	{ value: 'number', label: 'Number' },
	{ value: 'percentage', label: 'Percentage' },
	{ value: 'duration', label: 'Duration (min)' },
	{ value: 'boolean', label: 'Yes / No' }
];

// Knowledge Graph (Phase 5)

export type NodeType = 'note' | 'concept' | 'resource';

export interface KnowledgeNode {
	id: string;
	title: string;
	content: string;
	type: NodeType;
	color: string;
	x: number;
	y: number;
	archived: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface KnowledgeEdge {
	id: string;
	sourceId: string;
	targetId: string;
	label: string;
	createdAt: string;
}

export interface KnowledgeGraph {
	nodes: KnowledgeNode[];
	edges: KnowledgeEdge[];
}

export const NODE_TYPES: { value: NodeType; label: string; color: string }[] = [
	{ value: 'note', label: 'Note', color: '#6366f1' },
	{ value: 'concept', label: 'Concept', color: '#10b981' },
	{ value: 'resource', label: 'Resource', color: '#f59e0b' }
];
