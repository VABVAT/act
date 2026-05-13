"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProductImageRecord } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImageRecord[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number } | null>(null);
  const selectedImage = images[selectedIndex] ?? images[0];

  if (!selectedImage) {
    return null;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:grid lg:auto-rows-[96px]">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={cn(
              "relative h-24 min-w-24 overflow-hidden rounded-2xl border border-line bg-white/70",
              selectedIndex === index && "border-brand/45 ring-2 ring-brand/20",
            )}
            type="button"
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              alt={image.altText || `${productName} thumbnail ${index + 1}`}
              className="object-cover"
              fill
              sizes="96px"
              src={image.imageUrl}
            />
          </button>
        ))}
      </div>
      <div className="order-1 rounded-[32px] border border-line/70 bg-white/75 p-4 shadow-[0_28px_100px_rgba(106,72,56,0.08)]">
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-brand-soft/25"
          onMouseLeave={() => setZoomPosition(null)}
          onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width) * 100;
            const y = ((event.clientY - bounds.top) / bounds.height) * 100;
            setZoomPosition({ x, y });
          }}
        >
          <Image
            alt={selectedImage.altText || productName}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={selectedImage.imageUrl}
          />
          {zoomPosition ? (
            <div
              className="pointer-events-none absolute inset-0 hidden rounded-[28px] border border-white/40 bg-no-repeat lg:block"
              style={{
                backgroundImage: `url(${selectedImage.imageUrl})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundSize: "180%",
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
