CREATE TABLE `page_views` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`path` text NOT NULL,
	`count` integer NOT NULL
);
