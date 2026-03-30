import { getPortfolioShowcases } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import HomepageOrbitClient from "./HomepageOrbitClient";

export default async function HomepageOrbit() {
  let portfolioItems: PortfolioItem[] = [];

  try {
    portfolioItems = await getPortfolioShowcases();
  } catch {
    // API unavailable
  }

  return <HomepageOrbitClient portfolioItems={portfolioItems.slice(0, 6)} />;
}
