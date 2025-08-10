import type { CollectionEntry } from "astro:content";
import { createEffect, createSignal, For } from "solid-js";
import ArrowCard from "@components/ArrowCard";
import Tag from "./Tag";

type Props = {
  tags: string[];
  data: CollectionEntry<"blog">[];
};

export default function Blog({ data, tags }: Props) {
  const [filter, setFilter] = createSignal(new Set<string>());
  const [posts, setPosts] = createSignal<CollectionEntry<"blog">[]>([]);

  createEffect(() => {
    setPosts(
      data.filter((entry) =>
        Array.from(filter()).every((value) =>
          entry.data.tags.some(
            (tag: string) => tag.toLowerCase() === String(value).toLowerCase()
          )
        )
      )
    );
  });

  function toggleTag(tag: string) {
    setFilter(
      (prev) =>
        new Set(
          prev.has(tag) ? [...prev].filter((t) => t !== tag) : [...prev, tag]
        )
    );
  }

  return (
    <div class="flex flex-col gap-4">
      <div class="col-span-3 sm:col-span-1">
        <div class="flex gap-2 flex-wrap">
          <div class="text-lg">Tags:</div>
          <For each={tags}>
            {(tag) => (
              <Tag
                isActive={() => filter().has(tag)}
                text={tag}
                onClick={() => toggleTag(tag)}
              />
            )}
          </For>
        </div>
      </div>

      <div class="col-span-3 sm:col-span-2">
        <div class="flex flex-col">
          <div class="text-xs uppercase mb-2">
            SHOWING {posts().length} OF {data.length} POSTS
          </div>

          <ul class="flex flex-col gap-3">
            {posts().map((post) => (
              <li>
                <ArrowCard entry={post} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
