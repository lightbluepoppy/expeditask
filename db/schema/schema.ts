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

export const user = pgTable("user", {
    userID: varchar("user_id")
        .$defaultFn(() => createId())
        .primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    // account_id: varchar("id")
    //     .$defaultFn(() => createId())
    //     .primaryKey(),
})

export const task = pgTable("task", {
    taskID: varchar("task_id")
        .$defaultFn(() => createId())
        .primaryKey(),
    userID: varchar("task_author_id").references(() => user.userID),
    title: varchar("title", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    isArchived: boolean("is_archived"),
    recursivePattern: integer("recursive_pattern").array(),
    color: varchar("color", { length: 255 }),
    imageURL: varchar("image_url", { length: 255 }),
})

export const taskInstance = pgTable("task_instance", {
    taskInstanceID: varchar("task_instance_id").primaryKey(),
    taskID: varchar("task_id").references(() => task.taskID),
    title: varchar("title", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    isArchived: boolean("is_archived"),
    isDoable: boolean("is_doable"),
})

export const taskInstanceTimeEntry = pgTable("task_instance_time_entry", {
    taskInstanceID: varchar("task_instance_id").references(() => task.taskID),
    scheduledStartTime: timestamp("scheduled_start_time"),
    scheduledEndTime: timestamp("scheduled_end_time"),
    actualStartTime: timestamp("actual_start_time"),
    actualEndTime: timestamp("actual_end_time"),
})

export const taskInstanceStatistics = pgTable("task_statistics", {
    taskInstanceID: varchar("task_instance_id").references(
        () => taskInstance.taskInstanceID,
    ),
    goalTitle: varchar("goal_title", { length: 255 }),
    goalValue: integer("goal_value"),
    goalValueUnit: varchar("goal_value_unit", { length: 255 }),
    currentValue: integer("current_value"),
    note: jsonb("note"),
})

export const taskDependency = pgTable("task_dependency", {
    dependantTaskID: varchar("dependant_task_id").references(() => task.taskID),
    dependencyTaskID: varchar("dependency_task_id").references(() => task.taskID),
})

export const taskInstanceDependency = pgTable("task_instance_dependency", {
    dependantTaskInstanceID: varchar("dependant_task_instance_id").references(
        () => taskInstance.taskInstanceID,
    ),
    dependencyTaskInstanceID: varchar("dependency_task_instance_id").references(
        () => taskInstance.taskInstanceID,
    ),
})

export const taskTree = pgTable("task_tree", {
    parentTaskID: varchar("parent_task_id").references(() => task.taskID),
    childTaskInstanceID: varchar("child_task_id").references(() => task.taskID),
})

export const taskInstanceTree = pgTable("task_instance_tree", {
    parentTaskInstanceID: varchar("parent_task_instance_id").references(
        () => taskInstance.taskInstanceID,
    ),
    childTaskID: varchar("child_task_instance_id").references(
        () => taskInstance.taskInstanceID,
    ),
})

export const tag = pgTable("tag", {
    tagID: varchar("tag_id")
        .$defaultFn(() => createId())
        .primaryKey(),
    userID: varchar("user_id").references(() => user.userID),
    title: varchar("title", { length: 255 }),
    color: varchar("color", { length: 255 }),
    imageURL: varchar("image_url"),
})

export const tagTree = pgTable("tag_tree", {
    parentTagID: varchar("parent_tag_id")
        .primaryKey()
        .references(() => tag.tagID),
    childTagID: varchar("child_tag_id").references(() => tag.tagID),
})
