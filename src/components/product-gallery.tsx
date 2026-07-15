"use client";

import Image from "next/image";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

export type GallerySpec = { label: string; value: string };

/**
 * PDP media gallery. Because the catalog ships one product photo per series,
 * we pair the photo with a per-SKU spec frame so every SKU's gallery is
 * distinct and informative. The photo supports click-to-zoom (lightbox with
 * hover-pan); the whole thing is keyboard operable (←/→ between slides, Esc to
 * close the lightbox). Additional real photography drops straight into `images`.
 */
export function ProductGallery({
  images,
  title,
  specs,
}: {
  images: string[];
  title: string;
  specs: GallerySpec[];
}) {
  // Slides: each real photo, then the spec frame.
  const slides = [
    ...images.map((src) => ({ kind: "photo" as const, src })),
    { kind: "spec" as const },
  ];
  const [active, setActive] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);
  const [origin, setOrigin] = React.useState("50% 50%");

  const current = slides[active];
  const go = React.useCallback(
    (dir: number) => setActive((i) => (i + dir + slides.length) % slides.length),
    [slides.length]
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go]);

  React.useEffect(() => {
    if (!zoom) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoom]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main frame */}
      <div className="relative aspect-[16/11] overflow-hidden rounded-(--r-lg) border border-line bg-surface-2 shadow-[var(--shadow-md)]">
        {current.kind === "photo" ? (
          <>
            <Image
              src={current.src}
              alt={`${title} — view ${active + 1}`}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-contain p-6"
            />
            <button
              type="button"
              onClick={() => setZoom(true)}
              aria-label="Zoom image"
              className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-(--r-sm) border border-line bg-surface-1/90 text-ink-2 shadow-[var(--shadow-sm)] backdrop-blur transition-colors hover:text-ink-1"
            >
              <ZoomIn size={18} />
            </button>
          </>
        ) : (
          <SpecFrame title={title} specs={specs} />
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous view"
              className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface-1/90 text-ink-2 shadow-[var(--shadow-sm)] backdrop-blur transition-colors hover:text-ink-1"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next view"
              className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface-1/90 text-ink-2 shadow-[var(--shadow-sm)] backdrop-blur transition-colors hover:text-ink-1"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail rail */}
      <ul className="flex gap-2" role="tablist" aria-label="Product views">
        {slides.map((slide, index) => (
          <li key={index}>
            <button
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={slide.kind === "photo" ? `Photo ${index + 1}` : "Specifications"}
              onClick={() => setActive(index)}
              className={`relative grid size-16 place-items-center overflow-hidden rounded-(--r-sm) border bg-surface-1 transition-colors ${
                index === active ? "border-brand ring-2 ring-brand/25" : "border-line hover:border-line-strong"
              }`}
            >
              {slide.kind === "photo" ? (
                <Image src={slide.src} alt="" fill sizes="64px" className="object-contain p-1.5" />
              ) : (
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                  Specs
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Zoom lightbox */}
      {zoom && current.kind === "photo" && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--ink-panel)]/80 p-6 backdrop-blur-sm"
          onClick={() => setZoom(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} zoomed`}
        >
          <button
            type="button"
            aria-label="Close zoom"
            className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-surface-1 text-ink-1 shadow-[var(--shadow-md)]"
            onClick={() => setZoom(false)}
          >
            <X size={22} />
          </button>
          <div
            className="relative h-[80vh] w-[min(90vw,1100px)] cursor-zoom-out overflow-hidden rounded-(--r-lg) bg-surface-1"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={onMove}
            onMouseLeave={() => setOrigin("50% 50%")}
          >
            <div
              className="h-full w-full bg-contain bg-center bg-no-repeat transition-[background-size]"
              style={{
                backgroundImage: `url(${current.src})`,
                backgroundSize: "200%",
                backgroundPosition: origin,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SpecFrame({ title, specs }: { title: string; specs: GallerySpec[] }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-4 bg-[var(--supply-gradient)] p-8 text-white">
      <p className="font-display text-lg font-semibold tracking-tight">{title}</p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
        {specs.map((spec) => (
          <div key={spec.label}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">{spec.label}</dt>
            <dd className="tnum mt-1 font-mono text-lg font-semibold">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
