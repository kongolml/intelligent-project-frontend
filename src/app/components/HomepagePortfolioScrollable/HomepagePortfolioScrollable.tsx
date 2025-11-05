// types
import { PortfolioCategory, PortfolioItem, PortfolioItem as PortfolioItemType } from "../../../types/portfolio.types";
// import PortfolioItem from "."; // Adjust the import path as necessary

// components
import HomepagePortfolioScrollableClient from "./HomepagePortfolioScrollableClient";

export default async function HomepagePortfolioScrollable() {
	const showcasePortfolioItemsRequest = await fetch("http://localhost:3000/public-api/portfolio/showcases", {
		// Recommended for SSR caching control:
		// cache: "no-store", // or `next: { revalidate: 60 }` for ISR,
	});

	const showcasePortfolioItems: PortfolioItemType[] = await showcasePortfolioItemsRequest.json();

	// Randomly select 3 items
	const shuffled = [...showcasePortfolioItems].sort(() => Math.random() - 0.5);
	const randomItems = shuffled.slice(0, 3);

	return <HomepagePortfolioScrollableClient showcasePortfolioItems={randomItems} />;
}
