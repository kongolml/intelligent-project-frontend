import Image from "next/image";
import { notFound } from "next/navigation";
// types
import { PortfolioItem } from "../../../types/portfolio.types";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    // Fetch project by slug (for freshest data)
    const projectRequest = await fetch(`http://localhost:3000/public-api/portfolio/${params.slug}`, {
        // cache: "no-store",
    });
    const projectBySlug: PortfolioItem = await projectRequest.json();
console.log("Project by slug:", projectBySlug);
    return (
        <main>
            <h1>{projectBySlug.title}</h1>
            <p>{projectBySlug.description}</p>
            <p>Category: {projectBySlug.categories.map((cat) => cat.name).join(", ")}</p>
            <h2>Main Files:</h2>
            <Image
                src={projectBySlug.thumbnail}
                alt={projectBySlug.title}
                width={600}
                height={400}
                className="project-image"
            />
            <h2>Media Files:</h2>
            <ul>
                {projectBySlug.mediaFiles.map((fileUrl, index) => (
                    <li key={index}>
                        <Image
                            src={fileUrl}
                            alt={`${projectBySlug.title} media ${index + 1}`}
                            width={300}
                            height={200}
                            className="project-media-image"
                        />
                    </li>
                ))}
            </ul>
        </main>
    );
}
