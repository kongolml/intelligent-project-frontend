// lib
import { getPortfolioItems, getPortfolioCategories } from "../lib/api";
import { Suspense } from "react";

// components
import PortfolioList from "@/app/components/PortfolioList/PortfolioList";


export default async function ProjectsPage() {
	const [portfolioItems, portfolioCategories] = await Promise.all([
		getPortfolioItems(),
		getPortfolioCategories(),
	]);

	return (
		<main>
			<Suspense>
				<PortfolioList portfolioItems={portfolioItems} portfolioCategories={portfolioCategories} />
			</Suspense>
		</main>
	);
}
