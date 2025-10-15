import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { createAndUpdateTime, id, textField } from "./helper"
import { users } from "./user.schema"
import { relations } from "drizzle-orm"

export const posts = pgTable("posts", {
  id,

  content: textField("content"),
  mediaUrls: text("media_urls").array(), // Array of image/video URLs
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").default(true),
  allowComments: boolean("allow_comments").default(true),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  shareCount: integer("share_count").default(0),
  ...createAndUpdateTime,
})

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  // comments: many(comments),
  // likes: many(likes),
  // tags: many(postTags),
  // notifications: many(notifications),
}))
