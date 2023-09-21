import { getCollection, type CollectionEntry } from "astro:content";

export async function getPosts() {
  const collection = await getCollection("posts");

  return collection;
}

export function getPostUrl(post: CollectionEntry<"posts">): string {
  return `/posts/${post.slug}`;
}
