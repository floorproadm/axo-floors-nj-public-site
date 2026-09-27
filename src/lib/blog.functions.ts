import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const fetchBlogList = createServerFn({ method: "GET" }).handler(async () => {
  const { listPublishedPosts } = await import("./blog.server");
  return listPublishedPosts();
});

export const fetchBlogPost = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const { getPublishedPostPage } = await import("./blog.server");
    return getPublishedPostPage(data.slug);
  });
