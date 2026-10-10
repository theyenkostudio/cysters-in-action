import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

// Only pages that exist. Add /learn, /connect, /act and /about as they are built.
const paths = [
  { path: "/", priority: 1 },
  { path: "/donate", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    priority,
  }));
}
