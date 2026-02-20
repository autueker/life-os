CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '',
	`color` text DEFAULT '#6366f1',
	`icon` text DEFAULT 'folder',
	`sort_order` integer DEFAULT 0,
	`archived` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '',
	`status` text DEFAULT 'todo',
	`priority` text DEFAULT 'medium',
	`project_id` text,
	`due_date` text,
	`sort_order` integer DEFAULT 0,
	`archived` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `task_project_idx` ON `tasks` (`project_id`);