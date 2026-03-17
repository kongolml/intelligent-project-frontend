import { notFound } from "next/navigation";
import { getPortfolioItemBySlug } from "../../lib/api";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    const project = await getPortfolioItemBySlug(slug);

    if (!project) {
        notFound();
    }

    return <main><ProjectDetailClient project={project} /></main>;
}
