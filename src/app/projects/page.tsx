// lib
import { getPortfolioItems, getPortfolioCategories } from "../lib/api";

// components
import PortfolioList from "@/app/components/PortfolioList/PortfolioList";

export default async function ProjectsPage() {
	const [portfolioItems, portfolioCategories] = await Promise.all([
		getPortfolioItems(),
		getPortfolioCategories(),
	]);

	return (
		<main>
			<PortfolioList portfolioItems={portfolioItems} portfolioCategories={portfolioCategories} />
		</main>
	);
}
