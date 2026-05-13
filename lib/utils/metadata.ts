import type { Metadata } from "next";

import { site } from "@/lib/constants/site";
import { getSiteUrl } from "@/lib/utils/env";

type MetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export function buildMetadata(options: MetadataOptions = {}): Metadata {
  const title = options.title ? `${options.title} | ${site.name}` : site.title;
  const description = options.description || site.description;
  const image = options.image || absoluteUrl("/catalog/rosewood-regal-main.svg");
  const canonicalPath = options.path || "/";

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 1400,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
