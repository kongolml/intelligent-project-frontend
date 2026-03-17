import Link from 'next/link'

// lib
import { getPortfolioItems, getPortfolioCategories } from "../lib/api";

// types
import { PortfolioCategory, PortfolioItem } from "../../types/portfolio.types";

// components
import PortfolioList from "@/app/components/PortfolioList/PortfolioList";

export default async function ProjectsPage() {
	let portfolioItems: PortfolioItem[] = [];
	let portfolioCategories: PortfolioCategory[] = [];

	try {
		portfolioItems = await getPortfolioItems();
	} catch {
		// API unavailable — render with empty portfolio
	}

	try {
		portfolioCategories = await getPortfolioCategories();
	} catch {
		// API unavailable — render with empty categories
	}

	return (
		<main>
            <section>
            {/* <div className="container mx-auto px-4">
                <div className="flex flex-wrap -mx-2"> */}

<PortfolioList portfolioItems={portfolioItems} portfolioCategories={portfolioCategories} />
                {/* </div>
            </div> */}

            {/* <ul className={styles.categoriesList}>
                <li onClick={() => filterPortfolioItemsByCategory("all")}>All</li>
                {portfolioCategories.map((category) => (
                    <li key={category.slug} onClick={() => filterPortfolioItemsByCategory(category.slug)}>
                        {category.name}
                    </li>
                ))}
            </ul>

            <ul>
                {portfolioItems.map((item) => (
                    <li key={item.id}>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <p>Category: {item.categories.join(", ")}</p>
                        {item.mediaFiles.length > 0 && <p>has mediaFiles!</p>}
                        <Link href={`/projects/${item.id}`}>View Project</Link>
                    </li>
                ))}
            </ul> */}
            </section>
		</main>
	);
}
