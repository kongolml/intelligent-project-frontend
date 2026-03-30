import { getPortfolioShowcases } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import HomepageCasesClient from "./HomepageCasesClient";

export default async function HomepageCases() {
  let portfolioItems: PortfolioItem[] = [];

  try {
    portfolioItems = await getPortfolioShowcases();
  } catch {
    // API unavailable — render with empty array
  }

  return <HomepageCasesClient portfolioItems={portfolioItems.slice(0, 6)} />;
}
