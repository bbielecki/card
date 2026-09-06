import type { APIRoute } from 'astro';
import site from '../content/site.json';

export const GET: APIRoute = ({ site: origin }) => {
  const url = origin && !site.isDraft ? `<url><loc>${new URL('/', origin).href.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</loc></url>` : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${url}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
