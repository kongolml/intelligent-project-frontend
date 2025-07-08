import Link from 'next/link'

// types
import { PortfolioItem } from "../../types/portfolio.types";

export default async function ProjectsPage() {
	const portfolioRequest = await fetch("http://localhost:3000/public-api/portfolio", {
		// Recommended for SSR caching control:
		cache: "no-store", // or `next: { revalidate: 60 }` for ISR,
	});

	const portfolioItems: PortfolioItem[] = await portfolioRequest.json();

    console.log("portfolioItems data:", portfolioItems);

	return (
		<main>
			<h1>Projects Page</h1>

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
            </ul>
		</main>
	);
}
