import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Summit HVAC",
    description: SITE.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fa",
    theme_color: "#1f5f4f",
    icons: [
      { src: "/logo-summit.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
