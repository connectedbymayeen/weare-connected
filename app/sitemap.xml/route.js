// app/sitemap.xml/route.js

export async function GET() {
  const baseUrl = "https://weareconnected.io";

  const staticRoutes = [
    { path: "/", changefreq: "monthly", priority: "1.0" },
    { path: "/about", changefreq: "yearly", priority: "0.8" },
    { path: "/ventures", changefreq: "monthly", priority: "0.9" },
    { path: "/careers", changefreq: "monthly", priority: "0.9" },
    { path: "/blog", changefreq: "weekly", priority: "1.0" },
    { path: "/press-kit", changefreq: "yearly", priority: "0.6" },
    { path: "/case-studies", changefreq: "monthly", priority: "0.8" },
    { path: "/contact", changefreq: "yearly", priority: "0.7" },
    { path: "/privacy", changefreq: "yearly", priority: "0.6" },
    { path: "/terms", changefreq: "yearly", priority: "0.6" },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<!--  Created with ❤️ | SEO Optimized Sitemap  -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`
    )
    .join("")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
