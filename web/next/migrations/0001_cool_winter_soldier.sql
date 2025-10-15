ALTER TABLE "users" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_private" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_active" timestamp DEFAULT now();