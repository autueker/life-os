CREATE TABLE `habit_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`habit_id` text NOT NULL,
	`date` text NOT NULL,
	`value` real DEFAULT 1,
	`note` text DEFAULT '',
	`created_at` text NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `habit_date_idx` ON `habit_entries` (`habit_id`,`date`);--> statement-breakpoint
CREATE TABLE `habits` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '',
	`color` text DEFAULT '#6366f1',
	`icon` text DEFAULT 'activity',
	`frequency` text DEFAULT 'daily',
	`target_per_day` integer DEFAULT 1,
	`sort_order` integer DEFAULT 0,
	`archived` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
