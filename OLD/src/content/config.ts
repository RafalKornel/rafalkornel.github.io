import { defineCollection, z } from "astro:content";

const postSchema = z.object({
  title: z.string(),
  pubDate: z.date(),
  description: z.string(),
  author: z.string(),
  image: z.object({
    url: z.string(),
    alt: z.string(),
  }),
  tags: z.array(z.string()),
});

// export type Post = z.infer<typeof postSchema>;

const postCollection = defineCollection({
  schema: postSchema,
  type: "content",
});

export const collections = {
  posts: postCollection,
};
