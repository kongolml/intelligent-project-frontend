import HomepageCurator from "./components/HomepageCurator/HomepageCurator";

export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return <HomepageCurator />;
}
