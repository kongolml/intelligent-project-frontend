import Image from "next/image";
import { notFound } from "next/navigation";
// types
import { EditorJSDataBlockTypesEnum, PortfolioItem } from "../../../types/portfolio.types";

// styles
import styles from "./PortfolioItem.module.scss";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    // Fetch project by slug (for freshest data)
    const projectRequest = await fetch(`http://localhost:3000/public-api/portfolio/${(await params).slug}`, {
        // cache: "no-store",
    });
    const projectBySlug: PortfolioItem = await projectRequest.json();

    return (
        <main>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h1>{projectBySlug.title}</h1>
                            {/* <p>Category: {projectBySlug.categories.map((cat) => cat.name).join(", ")}</p> */}
                            {/* <h2>Main Files:</h2> */}
                            <Image
                                src={projectBySlug.thumbnail}
                                alt={projectBySlug.title}
                                width={600}
                                height={400}
                                className="project-image"
                            />
                            {projectBySlug.description && <EditorJSShow description={projectBySlug.description} />}
                            {projectBySlug.mediaFiles.length > 0 && (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}


const EditorJSShow = ({ description }: { description: PortfolioItem["description"] }) => {
    if (!description) return null;
console.log(description);
    return (
        <div>
            {typeof description === "string" ? <p>{description}</p> : description.map((block) => {
                switch (block.type) {
                    case EditorJSDataBlockTypesEnum.PARAGRAPH:
                        return <p key={block.id} className={styles.editorJSShowParagraph}>{block.data.text}</p>
                    case EditorJSDataBlockTypesEnum.HEADER:
                        // const Tag = `h${block.data.level || 2}`;
                        return <h2 key={block.id} className={styles.editorJSShowHeader2}>{block.data.text}</h2>
                    case EditorJSDataBlockTypesEnum.LIST:
                        // @ts-ignore
                        return <ul key={block.id} className={styles.editorJSShowList}>{block.items.map((item, index) => <li key={`list-item-${index}-${block.id}`}>{item.content}</li>)}</ul>
                    case EditorJSDataBlockTypesEnum.IMAGE:
                        return <Image
                            src={block.data.file.url}
                            alt={block.data.caption}
                            width={300}
                            height={200}
                            key={block.id}
                            className={styles.editorJSShowImage}
                        />
                }
            })}
        </div>
    );
}