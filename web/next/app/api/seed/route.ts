import { db } from "@/db/drizzle"
import { users } from "@/db/schema"
import { NextResponse } from "next/server"

const dummyUsers = [
  {
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    password: "$2b$10$examplehashedpassword",
    bio: "Software developer and tech enthusiast",
    avatar_url: "https://example.com/avatars/john.jpg",
    is_private: false,
  },
  {
    name: "Sarah Smith",
    username: "sarahsmith",
    email: "sarah@example.com",
    password: "$2b$10$examplehashedpassword",
    bio: "Digital artist and photographer",
    avatar_url: "https://example.com/avatars/sarah.jpg",
    is_private: true,
  },
  {
    name: "Mike Johnson",
    username: "mikej",
    email: "mike@example.com",
    password: "$2b$10$examplehashedpassword",
    bio: "Travel blogger and adventurer",
    avatar_url: "https://example.com/avatars/mike.jpg",
    is_private: false,
  },
]

export async function POST() {
  try {
    // Insert users into database
    const result = await db.insert(users).values(dummyUsers).returning()

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.length} users`,
      users: result,
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to seed data" },
      { status: 500 }
    )
  }
}
