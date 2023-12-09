import {
    boolean,
    char,
    integer,
    jsonb,
    pgTable,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core"
import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { relations } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

neonConfig.fetchConnectionCache = true
const sql = neon(process.env.DRIZZLE_DATABASE_URL!)
const db = drizzle(sql)
// const result = await db.select().from(...);

export const user = pgTable("user", {
    userID: varchar("user_id")
        .$defaultFn(() => createId())
        .primaryKey(),
    username: varchar("username").notNull(),
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
    title: varchar("title").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    // isArchived: integer("is_archived", { mode: "boolean" }),
    isArchived: boolean("is_archived"),
    recursivePattern: integer("recursive_pattern").array(),
    color: char("color", { length: 6 }),
    imageURL: varchar("image_url"),
})

export const taskInstance = pgTable("task_instance", {
    taskInstanceID: varchar("task_id")
        .$defaultFn(() => createId())
        .primaryKey(),
    // join table is less flexible
    // taskID: varchar("task_id").references(() => task.taskID),
    taskID: varchar("task_id").references(() => task.taskID),
    title: varchar("title").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    isArchived: boolean("is_archived"),
    isDoable: boolean("is_doable"),
})

export const taskInstanceTimeEntry = pgTable("task_instance_time_entry", {
    taskInstanceID: varchar("target_task_instance_id").references(() => task.taskID),
    scheduledStartTime: timestamp("scheduled_start_time"),
    scheduledEndTime: timestamp("scheduled_end_time"),
    actualStartTime: timestamp("actual_start_time"),
    actualEndTime: timestamp("actual_end_time"),
})

export const taskInstanceStatistics = pgTable("task_statistics", {
    taskInstanceID: varchar("target_task_instance_id").references(
        () => taskInstance.taskInstanceID,
    ),
    goalTitle: varchar("goal_title"),
    goalValue: integer("goal_value"),
    goalValueUnit: varchar("goal_value_unit"),
    currentValue: integer("current_value"),
    note: jsonb("note"),
})

export const taskDependency = pgTable("task_dependency", {
    taskID: varchar("task_id").references(() => task.taskID),
    dependencyTaskID: varchar("dependency_task_id").references(() => task.taskID),
})

export const taskInstanceDependency = pgTable("task_instance_dependency", {
    taskInstanceID: varchar("task_instance_id").references(
        () => taskInstance.taskInstanceID,
    ),
    dependencyTaskInstanceID: varchar("dependency_task_instance_id").references(
        () => taskInstance.taskInstanceID,
    ),
})

export const taskTree = pgTable("task_tree", {
    ancestorTaskID: varchar("ancestor_task_id").references(() => task.taskID),
    descendantTaskInstanceID: varchar("descendant_task_id").references(() => task.taskID),
})

export const taskInstanceTree = pgTable("task_instance_tree", {
    ancestorTaskInstanceID: varchar("ancestor_task_instance_id").references(
        () => taskInstance.taskInstanceID,
    ),
    descendantTaskID: varchar("descendant_task_instance_id").references(
        () => taskInstance.taskInstanceID,
    ),
})

export const tag = pgTable("tag", {
    tagID: varchar("tag_id")
        .$defaultFn(() => createId())
        .primaryKey(),
    userID: varchar("user_id").references(() => user.userID),
    title: varchar("title"),
    color: char("color", { length: 6 }),
    imageURL: varchar("image_url"),
})

export const tagTree = pgTable("tag_tree", {
    ancestorTagID: varchar("ancestor_tag_id").references(() => tag.tagID),
    descendantTagID: varchar("descendant_tag_id").references(() => tag.tagID),
})

// export const userRelation = relations(user, ({ many }) => ({
//     task: many(task),
//     tag: many(tag),
// }))

// export const taskRelation = relations(task, ({ one, many }) => ({
//     // taskAuthor: one(user, {
//     //     fields: [task.taskAuthorID],
//     //     references: [user.userID],
//     // }),
//     // taskInstance: many(taskInstance),
//     taskDependency: one(taskDependency, {
//         fields: [task.taskID],
//         references: [taskDependency.taskID],
//     }),
//     taskTree: one(taskTree, {
//         fields: [task.taskID],
//         references: [taskTree.ancestorTaskID],
//     }),
// }))

// export const taskInstanceRelation = relations(taskInstance, ({ one }) => ({
//     parentTask: one(task, {
//         fields: [taskInstance.taskID],
//         references: [task.taskID],
//     }),
//     taskInstanceDependency: one(taskInstanceDependency, {
//         fields: [taskInstance.taskInstanceID],
//         references: [taskInstanceDependency.taskInstanceID],
//     }),
//     taskInstanceTree: one(taskInstanceTree, {
//         fields: [taskInstance.taskInstanceID],
//         references: [taskInstanceTree.ancestorTaskInstanceID],
//     }),
// }))

// export const taskInstanceStatisticsRelation = relations(
//     taskInstanceStatistics,
//     ({ one }) => ({
//         taskInstance: one(taskInstance),
//     }),
// )

// export const taskInstanceTimeEntryRelation = relations(
//     taskInstanceTimeEntry,
//     ({ one }) => ({
//         taskInstance: one(taskInstance),
//     }),
// )

// export const taskDependencyRelation = relations(taskDependency, ({ many }) => ({
//     task: many(task),
// }))

// export const tagRelation = relations(tag, ({ one }) => ({
//     user: one(user),
//     tagTree: one(tagTree, {
//         fields: [tag.tagID],
//         references: [tagTree.ancestorTagID],
//     }),
// }))
