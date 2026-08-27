CREATE TABLE "url_shortener" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"original_url" text NOT NULL,
	"short_url" text NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "url_shortener_short_url_unique" UNIQUE("short_url")
);
