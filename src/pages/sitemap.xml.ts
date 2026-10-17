import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../content/site';

export const GET: APIRoute = async () => {
  const projects = await getCollection('cases');
  const paths = ['/', '/diensten', '/cases', '/contact', '/privacy', ...projects.map(project => `/cases/${project.id}`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${new URL(path, site.url)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
