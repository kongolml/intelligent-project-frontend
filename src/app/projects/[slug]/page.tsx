import { notFound } from "next/navigation";
import { getPortfolioItemBySlug, getPortfolioItems } from "../../lib/api";
import ProjectDetailClientV2 from "./ProjectDetailClientV2";

export async function generateStaticParams() {
    const items = await getPortfolioItems();
    return items.map(item => ({ slug: item.slug }));
}


export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    const project = await getPortfolioItemBySlug(slug);

    if (!project) {
        notFound();
    }

    return <main><ProjectDetailClientV2 project={project} /></main>;
}
