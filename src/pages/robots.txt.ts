import type { APIRoute } from "astro";
import site from "../content/site.json";

export const GET: APIRoute = ({ site: origin }) => {
  const published = origin && !site.isDraft;
  return new Response(
    published
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", origin)}\n`
      : "User-agent: *\nAllow: /\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
};
