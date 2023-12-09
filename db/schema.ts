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
    taskAuthorID: varchar("task_author_id"),
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
    taskID: varchar("task_id"),
    title: varchar("title").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    isArchived: boolean("is_archived"),
    isDoable: boolean("is_doable"),
})

export const taskInstanceTimeEntry = pgTable("task_instance_time_entry", {
    taskInstanceID: varchar("target_task_instance_id"),
    scheduledStartTime: timestamp("scheduled_start_time"),
    scheduledEndTime: timestamp("scheduled_end_time"),
    actualStartTime: timestamp("actual_start_time"),
    actualEndTime: timestamp("actual_end_time"),
})

export const taskInstanceStatistics = pgTable("task_statistics", {
    taskInstanceID: varchar("target_task_instance_id"),
    goalTitle: varchar("goal_title"),
    goalValue: integer("goal_value"),
    goalValueUnit: varchar("goal_value_unit"),
    currentValue: integer("current_value"),
    note: jsonb("note"),
})

export const taskDependency = pgTable("task_dependency", {
    taskID: varchar("task_id"),
    dependencyTaskID: varchar("dependency_task_id"),
})

export const taskInstanceDependency = pgTable("task_instance_dependency", {
    taskInstanceID: varchar("task_instance_id"),
    dependencyTaskInstanceID: varchar("dependency_task_instance_id"),
})

export const taskTree = pgTable("task_tree", {
    taskID: varchar("task_instance_id"),
    descendantTaskInstanceID: varchar("descendant_task_instance_id"),
})

export const taskInstanceTree = pgTable("task_instance_tree", {
    taskInstanceID: varchar("task_id"),
    descendantTaskID: varchar("descendant_task_id"),
})

export const userRelation = relations(user, ({ many }) => ({
    task: many(task),
}))

export const taskRelation = relations(task, ({ one, many }) => ({
    taskAuthor: one(user, {
        fields: [task.taskAuthorID],
        references: [user.userID],
    }),
    taskInstance: many(taskInstance),
}))

export const taskInstanceRelation = relations(taskInstance, ({ one }) => ({
    parentTask: one(task, {
        fields: [taskInstance.taskID],
        references: [task.taskID],
    }),
}))

export const taskInstanceStatisticsRelation = relations(
    taskInstanceStatistics,
    ({ one }) => ({
        taskInstance: one(taskInstance),
    }),
)

export const taskInstanceTimeEntryRelation = relations(
    taskInstanceTimeEntry,
    ({ one }) => ({
        taskInstance: one(taskInstance),
    }),
)

export const taskDependencyRelation = relations(taskDependency, ({ one }) => {
    task: one(task),
})
