import { notFound } from "next/navigation";
import { getPortfolioItemBySlug } from "../../lib/api";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    let project;
    try {
        project = await getPortfolioItemBySlug(slug);
    } catch {
        notFound();
    }

    if (!project) {
        notFound();
    }

    return <main><ProjectDetailClient project={project} /></main>;
}
