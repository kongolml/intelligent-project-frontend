import { getPortfolioShowcases } from "../../lib/api";
import HomepageCuratorClient from "./HomepageCuratorClient";

export default async function HomepageCurator() {
  const showcases = await getPortfolioShowcases();

  return <HomepageCuratorClient showcases={showcases} />;
}
