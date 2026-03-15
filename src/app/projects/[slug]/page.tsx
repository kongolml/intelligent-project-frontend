import { notFound } from "next/navigation";
import { PortfolioItem } from "../../../types/portfolio.types";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    const projectRequest = await fetch(`http://localhost:3000/public-api/portfolio/${slug}`, {
        // cache: "no-store",
    });

    if (!projectRequest.ok) {
        notFound();
    }

    const project: PortfolioItem = await projectRequest.json();

    return <ProjectDetailClient project={project} />;
}
