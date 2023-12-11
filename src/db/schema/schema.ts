import {
    boolean,
    // char,
    integer,
    jsonb,
    pgTable,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const users = pgTable("users", {
    userID: varchar("user_id")
        .$defaultFn(() => createId())
        .primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    // account_id: varchar("id")
    //     .$defaultFn(() => createId())
    //     .primaryKey(),
})

export const tasks = pgTable("tasks", {
    taskID: varchar("task_id")
        .$defaultFn(() => createId())
        .primaryKey(),
    userID: varchar("task_author_id").references(() => users.userID),
    title: varchar("title", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    isArchived: boolean("is_archived"),
    recursivePattern: integer("recursive_pattern").array(),
    color: varchar("color", { length: 255 }),
    imageURL: varchar("image_url", { length: 255 }),
})

export const taskInstances = pgTable("task_instances", {
    taskInstanceID: varchar("task_instance_id").primaryKey(),
    taskID: varchar("task_id").references(() => tasks.taskID),
    title: varchar("title", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    isArchived: boolean("is_archived"),
    isDoable: boolean("is_doable"),
})

export const taskInstanceTimeEntry = pgTable("task_instance_time_entry", {
    taskInstanceID: varchar("task_instance_id").references(() => tasks.taskID),
    scheduledStartTime: timestamp("scheduled_start_time"),
    scheduledEndTime: timestamp("scheduled_end_time"),
    actualStartTime: timestamp("actual_start_time"),
    actualEndTime: timestamp("actual_end_time"),
})

export const taskInstanceStatistics = pgTable("task_statistics", {
    taskInstanceID: varchar("task_instance_id").references(
        () => taskInstances.taskInstanceID,
    ),
    goalTitle: varchar("goal_title", { length: 255 }),
    goalValue: integer("goal_value"),
    goalValueUnit: varchar("goal_value_unit", { length: 255 }),
    currentValue: integer("current_value"),
    note: jsonb("note"),
})

export const taskDependency = pgTable("task_dependency", {
    dependantTaskID: varchar("dependant_task_id").references(() => tasks.taskID),
    dependencyTaskID: varchar("dependency_task_id").references(() => tasks.taskID),
})

export const taskInstanceDependency = pgTable("task_instance_dependency", {
    dependantTaskInstanceID: varchar("dependant_task_instance_id").references(
        () => taskInstances.taskInstanceID,
    ),
    dependencyTaskInstanceID: varchar("dependency_task_instance_id").references(
        () => taskInstances.taskInstanceID,
    ),
})

export const taskTree = pgTable("task_tree", {
    parentTaskID: varchar("parent_task_id").references(() => tasks.taskID),
    childTaskInstanceID: varchar("child_task_id").references(() => tasks.taskID),
})

export const taskInstanceTree = pgTable("task_instance_tree", {
    parentTaskInstanceID: varchar("parent_task_instance_id").references(
        () => taskInstances.taskInstanceID,
    ),
    childTaskID: varchar("child_task_instance_id").references(
        () => taskInstances.taskInstanceID,
    ),
})

export const tags = pgTable("tags", {
    tagID: varchar("tag_id")
        .$defaultFn(() => createId())
        .primaryKey(),
    userID: varchar("user_id").references(() => users.userID),
    title: varchar("title", { length: 255 }),
    color: varchar("color", { length: 255 }),
    imageURL: varchar("image_url"),
})

export const tagTree = pgTable("tag_tree", {
    parentTagID: varchar("parent_tag_id")
        .primaryKey()
        .references(() => tags.tagID),
    childTagID: varchar("child_tag_id").references(() => tags.tagID),
})

export type Users = InferModel<typeof users>
export type Tasks = InferModel<typeof tasks>
export type TaskInstances = InferModel<typeof taskInstances>
export type TaskInstanceTimeEntry = InferModel<typeof taskInstanceTimeEntry>
export type TaskInstanceStatistics = InferModel<typeof taskInstanceStatistics>
export type Tags = InferModel<typeof tags>
