import Image from "next/image";
import { SITE } from "@/lib/site";

const CERTIFICATIONS = [
  {
    name: "AHRI Certified",
    image: "/certifications/ahri-certified.png",
    href: SITE.ahriDirectory,
    width: 160,
  },
  {
    name: "ENERGY STAR",
    image: "/certifications/energy-star.png",
    href: SITE.energyStar,
    width: 92,
  },
  {
    name: "ETL Intertek",
    image: "/certifications/etl-intertek.png",
    href: "https://www.intertek.com/marks/etl/",
    width: 98,
  },
  {
    name: "NEEP",
    image: "/certifications/neep.png",
    href: "https://neep.org/",
    width: 86,
  },
] as const;

/* Certification logos mirror the live Summit HVAC Supply product lineup trust band. */
export function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-6 ${className}`}
    >
      {CERTIFICATIONS.map((cert) => (
        <a
          key={cert.name}
          href={cert.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={cert.name}
          className="flex h-20 items-center justify-center rounded-[--r-sm] bg-white px-4 transition-transform hover:-translate-y-0.5"
        >
          <Image
            src={cert.image}
            alt={cert.name}
            width={cert.width}
            height={80}
            className="max-h-16 w-auto object-contain"
          />
        </a>
      ))}
    </div>
  );
}
