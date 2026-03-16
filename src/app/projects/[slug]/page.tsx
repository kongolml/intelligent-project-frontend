import { notFound } from "next/navigation";
import { getApiUrl } from "../../lib/api";
import { PortfolioItem } from "../../../types/portfolio.types";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    let projectRequest;
    try {
        projectRequest = await fetch(`${getApiUrl()}/public-api/portfolio/${slug}`);
    } catch {
        notFound();
    }

    if (!projectRequest.ok) {
        notFound();
    }

    const project: PortfolioItem = await projectRequest.json();

    return <ProjectDetailClient project={project} />;
}
