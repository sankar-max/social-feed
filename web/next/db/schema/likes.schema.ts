import { relations } from "drizzle-orm"
import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core"
import { id } from "./helper"
import { posts } from "./post.schema"
import { users } from "./user.schema"

export const likes = pgTable(
  "likes",
  {
    id,
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    // commentId: uuid("comment_id").references(() => comments.id, {
    //   onDelete: "cascade",
    // }),
  },
  (table) => {
    return {
      // Ensure user can only like a post once
      uniquePostLike: uniqueIndex("unique_post_like").on(
        table.userId,
        table.postId
      ),
      // Ensure user can only like a comment once
      // uniqueCommentLike: uniqueIndex("unique_comment_like")
      //   .on(table.userId, table.commentId)
      //   .where(table.commentId.isNotNull()),
    }
  }
)
export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  // comment: one(comments, {
  //   fields: [likes.commentId],
  //   references: [comments.id],
  // }),
}))
