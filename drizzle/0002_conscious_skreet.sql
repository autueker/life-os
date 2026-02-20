CREATE TABLE `knowledge_edges` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`target_id` text NOT NULL,
	`label` text DEFAULT '',
	`created_at` text NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `knowledge_nodes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_id`) REFERENCES `knowledge_nodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `edge_source_idx` ON `knowledge_edges` (`source_id`);--> statement-breakpoint
CREATE INDEX `edge_target_idx` ON `knowledge_edges` (`target_id`);--> statement-breakpoint
CREATE TABLE `knowledge_nodes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '',
	`type` text DEFAULT 'note',
	`color` text DEFAULT '#6366f1',
	`x` real DEFAULT 0,
	`y` real DEFAULT 0,
	`archived` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `metric_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`metric_id` text NOT NULL,
	`date` text NOT NULL,
	`value` real NOT NULL,
	`note` text DEFAULT '',
	`created_at` text NOT NULL,
	FOREIGN KEY (`metric_id`) REFERENCES `metrics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `metric_date_idx` ON `metric_entries` (`metric_id`,`date`);--> statement-breakpoint
CREATE TABLE `metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '',
	`unit` text DEFAULT '',
	`color` text DEFAULT '#6366f1',
	`type` text DEFAULT 'number',
	`target_value` real,
	`sort_order` integer DEFAULT 0,
	`archived` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
