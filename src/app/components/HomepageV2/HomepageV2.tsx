import { getPortfolioShowcases } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import HomepageV2Client from "./HomepageV2Client";

export default async function HomepageV2() {
  let showcasePortfolioItems: PortfolioItem[] = [];

  try {
    showcasePortfolioItems = await getPortfolioShowcases();
  } catch {
    // API unavailable — render with empty showcase
  }

  const featuredItems = showcasePortfolioItems.slice(0, 4);

  return <HomepageV2Client portfolioItems={featuredItems} />;
}
