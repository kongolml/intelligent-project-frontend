import { getPortfolioShowcases } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import HomepageTheatreClient from "./HomepageTheatreClient";

export default async function HomepageTheatre() {
  let portfolioItems: PortfolioItem[] = [];

  try {
    portfolioItems = await getPortfolioShowcases();
  } catch {
    // API unavailable
  }

  return <HomepageTheatreClient portfolioItems={portfolioItems.slice(0, 6)} />;
}
