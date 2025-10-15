import { relations } from "drizzle-orm"
import { boolean, pgTable, timestamp } from "drizzle-orm/pg-core"
import {
 createAndUpdateTime,
 id,
 optionalText,
 textField,
 textFieldOptional,
 uniqueText,
} from "./helper"
import { posts } from "./post.schema"

export const users = pgTable("users", {
  id,
  name: textField("name"),
  username: textField("username"),
  password: textField("password"),
  bio: textFieldOptional("bio"),
  is_private: boolean("is_private").default(false),
  last_active: timestamp("last_active").defaultNow(),
  email: uniqueText("email"),
  avatar_url: optionalText("avatar_url"),
  ...createAndUpdateTime,
})
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  // comments: many(comments),
  // likes: many(likes),
  // sentFriendRequests: many(friendships, { relationName: "sentRequests" }),
  // receivedFriendRequests: many(friendships, {
  //   relationName: "receivedRequests",
  // }),
  // sentMessages: many(messages, { relationName: "sentMessages" }),
  // receivedMessages: many(messages, { relationName: "receivedMessages" }),
  // notifications: many(notifications),
}))