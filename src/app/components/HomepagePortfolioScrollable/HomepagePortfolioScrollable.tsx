// lib
import { getApiUrl } from "../../lib/api";

// types
import { PortfolioCategory, PortfolioItem, PortfolioItem as PortfolioItemType } from "../../../types/portfolio.types";
// import PortfolioItem from "."; // Adjust the import path as necessary

// components
import HomepagePortfolioScrollableClient from "./HomepagePortfolioScrollableClient";

export default async function HomepagePortfolioScrollable() {
	let showcasePortfolioItems: PortfolioItemType[] = [];

	try {
		const showcasePortfolioItemsRequest = await fetch(`${getApiUrl()}/public-api/portfolio/showcases`);
		if (showcasePortfolioItemsRequest.ok) {
			showcasePortfolioItems = await showcasePortfolioItemsRequest.json();
		}
	} catch {
		// API unavailable — render with empty showcase
	}

	// Randomly select 3 items
	const shuffled = [...showcasePortfolioItems].sort(() => Math.random() - 0.5);
	const randomItems = shuffled.slice(0, 3);

	return <HomepagePortfolioScrollableClient showcasePortfolioItems={randomItems} />;
}
