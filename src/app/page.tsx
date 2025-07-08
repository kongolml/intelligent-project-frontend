// components
import HomepagePortfolio from "./components/HomepagePortfolio/HomepagePortfolio";
import ServicesList from "./components/ServicesList";
import Script from "next/script";

// types
import { PortfolioCategory, PortfolioItem } from "../types/portfolio.types";

// import  "./lib/scrollmagic-gsap.ts";
// import animationGsap from "../../public/vendor/scroll-magic/animation.gsap";

export default async function Home() {
  const portfolioCategoriesRequest = await fetch("http://localhost:3000/public-api/portfolio-categories", {
		// Recommended for SSR caching control:
		cache: "no-store", // or `next: { revalidate: 60 }` for ISR,
	});

	const portfolioCategories: PortfolioCategory[] = await portfolioCategoriesRequest.json();
  // const portfolioItems: PortfolioItem[] = await res.json();

	return (
		<>
		<main role="main" className="homepage">
      <HomepagePortfolio />

      <ServicesList portfolioCategories={portfolioCategories} />
		</main>

		<Script src="https://cdn.jsdelivr.net/npm/gsap@3.13/dist/gsap.min.js" strategy="beforeInteractive" />
        <Script src="http://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/ScrollMagic.min.js" strategy="beforeInteractive" />
        <Script src="/vendor/scroll-magic/animation.gsap.js" strategy="beforeInteractive" />
		</>
	);
}
