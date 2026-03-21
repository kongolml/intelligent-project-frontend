import { PortfolioCategory, PortfolioCategorySlugs, PortfolioItem, EditorJSDataBlock } from "../../types/portfolio.types";
import { Teammate } from "../../types/teammate.types";
import {
  PayloadPaginatedResponse,
  PayloadMediaFile,
  PayloadPortfolioItem,
  PayloadTeammate,
} from "../../types/payload.types";

export function getApiUrl(): string {
  const url = process.env.API_URL;
  if (!url) {
    throw new Error("API_URL environment variable is not set");
  }
  return url;
}

// --- Internal helpers ---

async function fetchFromPayload<T>(path: string, options?: RequestInit): Promise<T[]> {
  const res = await fetch(`${getApiUrl()}/api/${path}`, options);
  if (!res.ok) throw new Error(`PayloadCMS fetch failed: ${res.status} ${res.statusText}`);
  const data: PayloadPaginatedResponse<T> = await res.json();
  return data.docs;
}

function resolveMediaUrl(media: PayloadMediaFile | string | null | undefined): string {
  if (!media) return "";
  if (typeof media === "string") return media;
  return media.url ?? "";
}

function mapPortfolioItem(raw: PayloadPortfolioItem): PortfolioItem {
  return {
    id: raw.id,
    title: raw.name,
    subtitle: raw.subtitle ?? undefined,
    client: raw.client ?? undefined,
    year: raw.year ?? undefined,
    description: (raw.description as EditorJSDataBlock[] | null) ?? undefined,
    descriptionHTML: raw.descriptionHTML ?? undefined,
    client_goalHTML: raw.client_goalHTML ?? undefined,
    our_taskHTML: raw.our_taskHTML ?? undefined,
    conceptHTML: raw.conceptHTML ?? undefined,
    categories: (raw.categories ?? []).map((c) => ({ name: c.name, slug: c.slug as PortfolioCategorySlugs })),
    thumbnail: resolveMediaUrl(raw.thumbnail),
    mediaFiles: (raw.mediaFiles ?? []).map((m) => resolveMediaUrl(m)),
    visual_inspiration: (raw.visual_inspiration ?? []).map((m) => resolveMediaUrl(m)),
    visual_exploration: (raw.visual_exploration ?? []).map((m) => resolveMediaUrl(m)),
    slug: raw.slug,
    isShowcase: raw.isShowcase ?? undefined,
  };
}

function mapTeammate(raw: PayloadTeammate): Teammate {
  return {
    id: raw.id,
    name: raw.name,
    title: raw.title,
    image: (raw.image ?? []).map((m) => resolveMediaUrl(m)),
  };
}

// --- Public API functions ---

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const docs = await fetchFromPayload<PayloadPortfolioItem>(
    "portfolio-items?depth=1&limit=0",
    // { cache: "no-store" },
  ).catch((err) => {
    console.error("Failed to fetch portfolio items:", err);
    return [];
  });
  return docs.map(mapPortfolioItem);
}

export async function getPortfolioShowcases(): Promise<PortfolioItem[]> {
  const docs = await fetchFromPayload<PayloadPortfolioItem>(
    "portfolio-items?where[isShowcase][equals]=true&depth=1&limit=0",
  ).catch((err) => {
    console.error("Failed to fetch portfolio showcases:", err);
    return [];
  });
  return docs.map(mapPortfolioItem);
}

export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
  const docs = await fetchFromPayload<PayloadPortfolioItem>(
    `portfolio-items?where[slug][equals]=${encodeURIComponent(slug)}&depth=1`,
  ).catch((err) => {
    console.error(`Failed to fetch portfolio item by slug "${slug}":`, err);
    return null;
  });
  if (!docs || docs.length === 0) return null;
  return mapPortfolioItem(docs[0]);
}

export async function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  return fetchFromPayload<PortfolioCategory>("portfolio-categories?limit=0").catch((err) => {
    console.error("Failed to fetch portfolio categories:", err);
    return [];
  });
}

export async function getTeammates(): Promise<Teammate[]> {
  const docs = await fetchFromPayload<PayloadTeammate>("teammates?depth=1&limit=0").catch((err) => {
    console.error("Failed to fetch teammates:", err);
    return [];
  });
  return docs.map(mapTeammate);
}
