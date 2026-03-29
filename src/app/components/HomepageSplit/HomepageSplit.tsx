import { getPortfolioShowcases } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import HomepageSplitClient from "./HomepageSplitClient";

export default async function HomepageSplit() {
  let portfolioItems: PortfolioItem[] = [];

  try {
    portfolioItems = await getPortfolioShowcases();
  } catch {
    // API unavailable
  }

  return <HomepageSplitClient portfolioItems={portfolioItems.slice(0, 6)} />;
}
