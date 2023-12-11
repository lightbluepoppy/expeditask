CREATE TABLE IF NOT EXISTS "tag" (
	"tag_id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"title" varchar(255),
	"color" varchar(255),
	"image_url" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tag_tree" (
	"parent_tag_id" varchar PRIMARY KEY NOT NULL,
	"child_tag_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task" (
	"task_id" varchar PRIMARY KEY NOT NULL,
	"task_author_id" varchar,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_archived" boolean,
	"recursive_pattern" integer[],
	"color" varchar(255),
	"image_url" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_dependency" (
	"dependant_task_id" varchar,
	"dependency_task_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_instance" (
	"task_instance_id" varchar PRIMARY KEY NOT NULL,
	"task_id" varchar,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_archived" boolean,
	"is_doable" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_instance_dependency" (
	"dependant_task_instance_id" varchar,
	"dependency_task_instance_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_statistics" (
	"task_instance_id" varchar,
	"goal_title" varchar(255),
	"goal_value" integer,
	"goal_value_unit" varchar(255),
	"current_value" integer,
	"note" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_instance_time_entry" (
	"task_instance_id" varchar,
	"scheduled_start_time" timestamp,
	"scheduled_end_time" timestamp,
	"actual_start_time" timestamp,
	"actual_end_time" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_instance_tree" (
	"parent_task_instance_id" varchar,
	"child_task_instance_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_tree" (
	"parent_task_id" varchar,
	"child_task_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tag" ADD CONSTRAINT "tag_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tag_tree" ADD CONSTRAINT "tag_tree_parent_tag_id_tag_tag_id_fk" FOREIGN KEY ("parent_tag_id") REFERENCES "tag"("tag_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tag_tree" ADD CONSTRAINT "tag_tree_child_tag_id_tag_tag_id_fk" FOREIGN KEY ("child_tag_id") REFERENCES "tag"("tag_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_task_author_id_user_user_id_fk" FOREIGN KEY ("task_author_id") REFERENCES "user"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_dependency" ADD CONSTRAINT "task_dependency_dependant_task_id_task_task_id_fk" FOREIGN KEY ("dependant_task_id") REFERENCES "task"("task_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_dependency" ADD CONSTRAINT "task_dependency_dependency_task_id_task_task_id_fk" FOREIGN KEY ("dependency_task_id") REFERENCES "task"("task_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_instance" ADD CONSTRAINT "task_instance_task_id_task_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "task"("task_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_instance_dependency" ADD CONSTRAINT "task_instance_dependency_dependant_task_instance_id_task_instance_task_instance_id_fk" FOREIGN KEY ("dependant_task_instance_id") REFERENCES "task_instance"("task_instance_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_instance_dependency" ADD CONSTRAINT "task_instance_dependency_dependency_task_instance_id_task_instance_task_instance_id_fk" FOREIGN KEY ("dependency_task_instance_id") REFERENCES "task_instance"("task_instance_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_statistics" ADD CONSTRAINT "task_statistics_task_instance_id_task_instance_task_instance_id_fk" FOREIGN KEY ("task_instance_id") REFERENCES "task_instance"("task_instance_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_instance_time_entry" ADD CONSTRAINT "task_instance_time_entry_task_instance_id_task_task_id_fk" FOREIGN KEY ("task_instance_id") REFERENCES "task"("task_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_instance_tree" ADD CONSTRAINT "task_instance_tree_parent_task_instance_id_task_instance_task_instance_id_fk" FOREIGN KEY ("parent_task_instance_id") REFERENCES "task_instance"("task_instance_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_instance_tree" ADD CONSTRAINT "task_instance_tree_child_task_instance_id_task_instance_task_instance_id_fk" FOREIGN KEY ("child_task_instance_id") REFERENCES "task_instance"("task_instance_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_tree" ADD CONSTRAINT "task_tree_parent_task_id_task_task_id_fk" FOREIGN KEY ("parent_task_id") REFERENCES "task"("task_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_tree" ADD CONSTRAINT "task_tree_child_task_id_task_task_id_fk" FOREIGN KEY ("child_task_id") REFERENCES "task"("task_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
