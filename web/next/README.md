import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

// ===== USERS =====
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashed password
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  isPrivate: boolean("is_private").default(false),
  isVerified: boolean("is_verified").default(false),
  lastActive: timestamp("last_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// ===== POSTS =====
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  mediaUrls: text("media_urls").array(), // Array of image/video URLs
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").default(true),
  allowComments: boolean("allow_comments").default(true),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  shareCount: integer("share_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// ===== COMMENTS =====
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id").references(() => comments.id), // For nested comments
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// ===== LIKES =====
export const likes = pgTable(
  "likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id").references(() => comments.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      // Ensure user can only like a post once
      uniquePostLike: uniqueIndex("unique_post_like")
        .on(table.userId, table.postId)
        .where(table.postId.isNotNull()),
      // Ensure user can only like a comment once
      uniqueCommentLike: uniqueIndex("unique_comment_like")
        .on(table.userId, table.commentId)
        .where(table.commentId.isNotNull()),
    }
  }
)

// ===== FRIENDSHIPS =====
export const friendships = pgTable(
  "friendships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    friendId: uuid("friend_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status", {
      enum: ["pending", "accepted", "rejected", "blocked"],
    }).default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      // Ensure unique friendship pairs
      uniqueFriendship: uniqueIndex("unique_friendship").on(
        table.userId,
        table.friendId
      ),
    }
  }
)

// ===== TAGS =====
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  postCount: integer("post_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
})

// ===== POST TAGS (Many-to-Many) =====
export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      // Composite primary key
      pk: primaryKey({ columns: [table.postId, table.tagId] }),
    }
  }
)

// ===== MESSAGES =====
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: uuid("receiver_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

// ===== NOTIFICATIONS =====
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type", {
    enum: ["like", "comment", "friend_request", "message", "tag"],
  }).notNull(),
  actorId: uuid("actor_id")
    .notNull()
    .references(() => users.id),
  postId: uuid("post_id").references(() => posts.id),
  commentId: uuid("comment_id").references(() => comments.id),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

// ===== RELATIONS =====
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  sentFriendRequests: many(friendships, { relationName: "sentRequests" }),
  receivedFriendRequests: many(friendships, {
    relationName: "receivedRequests",
  }),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  notifications: many(notifications),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
  tags: many(postTags),
  notifications: many(notifications),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "replies",
  }),
  replies: many(comments, { relationName: "replies" }),
  likes: many(likes),
}))

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [likes.commentId],
    references: [comments.id],
  }),
}))

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  user: one(users, {
    fields: [friendships.userId],
    references: [users.id],
    relationName: "sentRequests",
  }),
  friend: one(users, {
    fields: [friendships.friendId],
    references: [users.id],
    relationName: "receivedRequests",
  }),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  actor: one(users, {
    fields: [notifications.actorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [notifications.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [notifications.commentId],
    references: [comments.id],
  }),
}))

// ===== ZOD SCHEMAS FOR VALIDATION =====
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  username: z.string().min(3).max(30),
  displayName: z.string().min(1).max(50).optional(),
})

export const insertPostSchema = createInsertSchema(posts, {
  content: z.string().min(1).max(1000),
})

export const insertCommentSchema = createInsertSchema(comments, {
  content: z.string().min(1).max(500),
})

export const insertFriendshipSchema = createInsertSchema(friendships)

export type User = typeof users.$inferSelect
export type Post = typeof posts.$inferSelect
export type Comment = typeof comments.$inferSelect
export type Like = typeof likes.$inferSelect
export type Friendship = typeof friendships.$inferSelect
export type Tag = typeof tags.$inferSelect
export type Message = typeof messages.$inferSelect
export type Notification = typeof notifications.$inferSelect
