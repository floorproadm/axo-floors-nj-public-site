import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const fetchBlogList = createServerFn({ method: "GET" }).handler(async () => {
  const { listPublishedPosts } = await import("./blog.server");
  return listPublishedPosts();
});

export const fetchBlogPost = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { getPublishedPost } = await import("./blog.server");
    return getPublishedPost(data.slug);
  });
