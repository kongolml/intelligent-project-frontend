// lib
import { getPortfolioShowcases } from "../../lib/api";

// types
import { PortfolioItem as PortfolioItemType } from "../../../types/portfolio.types";

// components
import HomepagePortfolioScrollableClient from "./HomepagePortfolioScrollableClient";

export default async function HomepagePortfolioScrollable() {
	let showcasePortfolioItems: PortfolioItemType[] = [];

	try {
		showcasePortfolioItems = await getPortfolioShowcases();
	} catch {
		// API unavailable — render with empty showcase
	}

	// Randomly select 3 items
	const shuffled = [...showcasePortfolioItems].sort(() => Math.random() - 0.5);
	const randomItems = shuffled.slice(0, 3);

	return <HomepagePortfolioScrollableClient showcasePortfolioItems={randomItems} />;
}
