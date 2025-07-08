// types
import { PortfolioCategory, PortfolioItem, PortfolioItem as PortfolioItemType } from "../../../types/portfolio.types";
// import PortfolioItem from "."; // Adjust the import path as necessary

// styles
import styles from "./HomepagePortfolio.module.scss";

// hooks
import useScrollEffects from "@/app/hooks/useScrollEffects";
import HomepagePortfolioClient from "./HomepagePortfolioClient";


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
    // const randomPortfolioItemsPromises = portfolioCategories.map(async (category) => {
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

      const randomPortfolioItemsRequest= await fetch("http://localhost:3000/public-api/portfolio/random-demo", {
		// Recommended for SSR caching control:
		cache: "no-store", // or `next: { revalidate: 60 }` for ISR,
	});

    const randomPortfolioItems: PortfolioItemType[] = await randomPortfolioItemsRequest.json();

    console.log(randomPortfolioItems)

    // const randomPortfolioItems: PortfolioItem[] = await response.json();

  return <HomepagePortfolioClient randomPortfolioItems={randomPortfolioItems} />;
}