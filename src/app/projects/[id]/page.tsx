import Image from "next/image";

// types
import { PortfolioItem } from "../../../types/portfolio.types";

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const projectRequest = await fetch(`http://localhost:3000/public-api/portfolio/${params.id}`, {
        // Recommended for SSR caching control:
        cache: "no-store", // or `next: { revalidate: 60 }` for ISR,
    });

    const project: PortfolioItem = await projectRequest.json();

    console.log("Project data:", project);

    return (
        <main>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <p>Category: {project.categories.join(", ")}</p>
            
            <h2>Main Files:</h2>
            <Image
                src={project.thumbnail}
                alt={project.title}
                width={600}
                height={400}
                className="project-image"
            />
            <h2>Media Files:</h2>
            <ul>
                {project.mediaFiles.map((fileUrl: PortfolioItem["mediaFiles"][number], index: number) => (
                    <li key={index}>
                        <Image
                            src={fileUrl}
                            alt={`${project.title} media ${index + 1}`}
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