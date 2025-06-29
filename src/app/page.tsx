// components
import TypewriterBlock from "./components/TypeWrighterBlock";
import HomepagePortfolio from "./components/HomepagePortfolio/HomepagePortfolio";
import ServicesList from "./components/ServicesList";

// types
import { PortfolioCategory, PortfolioItem } from "../types/portfolio.types";

export default async function Home() {
  const portfolioCategoriesRequest = await fetch("http://localhost:3000/public-api/portfolio-categories", {
		// Recommended for SSR caching control:
		cache: "no-store", // or `next: { revalidate: 60 }` for ISR,
	});

	const portfolioCategories: PortfolioCategory[] = await portfolioCategoriesRequest.json();
  // const portfolioItems: PortfolioItem[] = await res.json();

	return (
		<main role="main" className="homepage">
			<section className="hero flex">
				<div className="container">
					<div className="row">
						<div className="col-12 col-sm-8 offset-md-1">
							<div id="hero-into-text">
								<h1>Intelligent Project</h1>
								<TypewriterBlock />
							</div>
						</div>
					</div>
				</div>
			</section>

      <HomepagePortfolio />

      <ServicesList portfolioCategories={portfolioCategories} />
		</main>
	);
}
