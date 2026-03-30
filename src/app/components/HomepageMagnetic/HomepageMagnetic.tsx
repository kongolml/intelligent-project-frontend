import { getPortfolioShowcases } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import HomepageMagneticClient from "./HomepageMagneticClient";

export default async function HomepageMagnetic() {
  let portfolioItems: PortfolioItem[] = [];

  try {
    portfolioItems = await getPortfolioShowcases();
  } catch {
    // API unavailable
  }

  return <HomepageMagneticClient portfolioItems={portfolioItems.slice(0, 6)} />;
}
