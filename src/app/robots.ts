import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/event/",
      },
    ],
    sitemap: "https://murinahi.vercel.app/sitemap.xml",
  };
}
