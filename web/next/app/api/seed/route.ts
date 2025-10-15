import { db } from "@/db/drizzle"
import { users } from "@/db/schema"
import { NextResponse } from "next/server"

const dummyUsers = [
  {
    name: "Juice WRLD",
    username: "juicewrld",
    email: "juicewrld@example.com",
    password: "$2b$10$examplehashedpassword",
    bio: "Melodic emo-rap legend known for freestyle genius and heartfelt lyrics about love and loss.",
    avatar_url:
      "https://i.scdn.co/image/ab6761610000e5eb56f6b05e52dc17474c50a2a8",
    is_private: false,
  },
  {
    name: "Lil Peep",
    username: "lilpeep",
    email: "lilpeep@example.com",
    password: "$2b$10$examplehashedpassword",
    bio: "Pioneer of emo-trap blending punk, sadness, and style into timeless anthems.",
    avatar_url:
      "https://i.scdn.co/image/ab6761610000e5ebf8f42e51c9a379f3c2e1c8e1",
    is_private: false,
  },
  {
    name: "XXXTENTACION",
    username: "xxxtentacion",
    email: "xxxtentacion@example.com",
    password: "$2b$10$examplehashedpassword",
    bio: "Versatile artist blending rage, sadness, and hope. Redefined the sound of SoundCloud rap.",
    avatar_url:
      "https://i.scdn.co/image/ab6761610000e5ebff9d6a5e2d519b2d30e2d28c",
    is_private: false,
  },
  {
    name: "Trippie Redd",
    username: "trippieredd",
    email: "trippieredd@example.com",
    password: "$2b$10$examplehashedpassword",
    bio: "Emotional trap star with a rock heart. Known for melodic screams and heartbreak vibes.",
    avatar_url:
      "https://i.scdn.co/image/ab6761610000e5ebc8b3a4fbe63c5bcb82b7a8f4",
    is_private: false,
  },
  {
    name: "$uicideboy$",
    username: "suicideboys",
    email: "suicideboys@example.com",
    password: "$2b$10$examplehashedpassword",
    bio: "Dark duo from New Orleans pushing the limits of emo-trap and horrorcore aesthetics.",
    avatar_url:
      "https://i.scdn.co/image/ab6761610000e5eb7acda9423bc0b7f2c5c72955",
    is_private: true,
  },
  {
    name: "Eminem",
    username: "eminem",
    email: "eminem@example.com",
    password: "$2b$10$examplehashedpassword",
    bio: "Rap god and lyrical storyteller whose influence reaches every corner of hip-hop.",
    avatar_url:
      "https://i.scdn.co/image/ab6761610000e5eb9d64c56a2fd62b7e833c0158",
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
