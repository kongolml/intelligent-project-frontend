export enum PortfolioCategorySlugs {
	IDENTITY = "identity",
	WEB = "web",
	PACKAGE = "package"
}

export interface PortfolioCategory {
	id: string;
	name: string;
	slug: PortfolioCategorySlugs;
	description: string;
}

export interface PortfolioItem {
	id: string;
	title: string;
	description?: string;
	categories: {
		name: PortfolioCategory["name"],
		slug: PortfolioCategory["slug"]
	}[];
	thumbnail: string; // URL to the main image
    mediaFiles: string[]; // urls
	slug: string;
	isShowcase?: boolean;
}