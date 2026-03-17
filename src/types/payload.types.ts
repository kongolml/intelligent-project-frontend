/**
 * Internal types describing PayloadCMS REST API responses.
 * Used only in the service layer (api.ts) for transformation.
 */

export interface PayloadPaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PayloadMediaFile {
  id: string;
  s3Key: string;
  bucket: string;
  mime: string;
  name: string;
  originalName: string;
  size: number;
  url: string;
}

export interface PayloadPortfolioCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface PayloadPortfolioItem {
  id: string;
  name: string;
  subtitle?: string | null;
  client?: string | null;
  year?: number | null;
  description?: unknown[] | null;
  categories: PayloadPortfolioCategory[];
  thumbnail: PayloadMediaFile | null;
  mediaFiles: PayloadMediaFile[];
  slug: string;
  isShowcase?: boolean;
}

export interface PayloadTeammate {
  id: string;
  name: string;
  title: string;
  image: PayloadMediaFile[];
}
