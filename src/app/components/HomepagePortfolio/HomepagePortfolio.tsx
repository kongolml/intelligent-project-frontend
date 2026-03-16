// lib
import { getApiUrl } from "../../lib/api";

// types
import { PortfolioCategory, PortfolioItem, PortfolioItem as PortfolioItemType } from "../../../types/portfolio.types";
// import PortfolioItem from "."; // Adjust the import path as necessary

// styles
import styles from "./HomepagePortfolio.module.scss";

// hooks
import useScrollEffects from "@/app/hooks/useScrollEffects";
import HomepagePortfolioClient from "./HomepagePortfolioClient";
import HomepagePortfolioBlocks from "../HomepagePortfolioBlocks/HomepagePortfolioBlocks";

export default async function HomepagePortfolio() {
	// const heroRef = useRef<HTMLElement>(null);
	// const projectsListRef = useRef<HTMLElement>(null);
	// const projectNavRef = useRef<HTMLElement>(null);
	// const projectsDemoRef = useRef<HTMLElement>(null);

	// const projectsCount = 5; // adjust to actual count
	// const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

	// useScrollEffects({
	//     isMobile,
	//     projectsCount,
	//     projectsListRef,
	//     projectNavRef,
	//     projectsDemoRef,
	//     heroRef,
	// });
	// const showcasePortfolioItemsPromises = portfolioCategories.map(async (category) => {
	//     const result = await PortfolioItem.aggregate([
	//         {
	//         $match: {
	//             status: 'publish',
	//             'categories': category.name,
	//         },
	//         },
	//         { $sample: { size: 1 } },
	//     ]);

	//     return result[0] || null;
	// });

	let showcasePortfolioItems: PortfolioItemType[] = [];

	try {
		const showcasePortfolioItemsRequest = await fetch(`${getApiUrl()}/public-api/portfolio/showcases`);
		if (showcasePortfolioItemsRequest.ok) {
			showcasePortfolioItems = await showcasePortfolioItemsRequest.json();
		}
	} catch {
		// API unavailable — render with empty showcase
	}

	// console.log(showcasePortfolioItems);

	// const showcasePortfolioItems: PortfolioItem[] = await response.json();

	// return <HomepagePortfolioClient showcasePortfolioItems={showcasePortfolioItems} />;
	return (
		<section>
			<div className="container">
				<div className="row">
					<div className="col-10 mx-auto">
						<HomepagePortfolioBlocks portfolioItems={showcasePortfolioItems} />
					</div>
				</div>
			</div>
		</section>
	);
}
