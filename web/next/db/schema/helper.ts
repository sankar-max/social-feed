import { text, timestamp, uuid } from "drizzle-orm/pg-core"

// Base field types
export const id = uuid("id").primaryKey().defaultRandom()
export const textField = (name: string) => text(name).notNull()
export const textFieldOptional = (name: string) => text(name)
export const optionalText = (name: string) => text(name)
export const uniqueText = (name: string) =>
  text(name).notNull().unique(`unique_${name}`)

// Timestamps
export const createAndUpdateTime = {
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}
