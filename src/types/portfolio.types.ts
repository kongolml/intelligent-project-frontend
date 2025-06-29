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
    mediaFiles: {
        id: string;
        url: string;
    }[]
}