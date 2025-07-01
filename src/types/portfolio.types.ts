export interface PortfolioCategory {
	id: string;
	name: string;
	description?: string;
}

export interface PortfolioItem {
	id: string;
	title: string;
	description?: string;
	categories: PortfolioCategory["name"][];
	mainImage: string; // URL to the main image
    mediaFiles: {
        id: string;
        url: string;
    }[]
}