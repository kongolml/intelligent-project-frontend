"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
    PortfolioItem,
    EditorJSDataBlockTypesEnum,
    EditorJSDataBlock,
} from "../../../types/portfolio.types";
import styles from "./ProjectDetail.module.scss";

interface ProjectDetailClientProps {
    project: PortfolioItem;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
    useRevealAnimations();

    // Extract first paragraph as intro text
    const { intro, restBlocks } = extractIntro(project.description);
    const categories = project.categories.map((c) => c.name).join(" / ");

    return (
        <div className={styles.casePage}>
            <div className={styles.noiseOverlay} aria-hidden="true" />

            {/* Hero */}
            <section className={styles.hero} data-reveal>
                <div className={styles.heroMedia}>
                    <div className={styles.heroImageWrapper}>
                        <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            className={styles.heroImage}
                            priority
                        />
                    </div>
                </div>
                <div className={styles.heroContent}>
                    {categories && (
                        <p className={styles.heroMeta} data-reveal-delay="1">
                            {categories}
                        </p>
                    )}
                    <h1 className={styles.heroTitle} data-reveal-delay="2">
                        {project.title}
                    </h1>
                    {intro && (
                        <p className={styles.heroIntro} data-reveal-delay="3">
                            {intro}
                        </p>
                    )}
                </div>
            </section>

            {/* Overview */}
            <section className={styles.overview} data-reveal>
                <div className={`${styles.grid} ${styles.gridOverview}`}>
                    {project.categories.map((cat, i) => (
                        <div className={styles.overviewItem} key={cat.slug} data-reveal-delay={String(i + 1)}>
                            <span className={styles.overviewLabel}>Category</span>
                            <span className={styles.overviewValue}>{cat.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Description Content */}
            {restBlocks.length > 0 && (
                <section className={styles.section} data-reveal>
                    <div className={styles.grid}>
                        <div className={styles.sectionContentWide}>
                            <EditorJSContent blocks={restBlocks} />
                        </div>
                    </div>
                </section>
            )}

            {/* Media Gallery */}
            {project.mediaFiles.length > 0 && (
                <section className={`${styles.section} ${styles.sectionGallery}`} data-reveal>
                    <div className={styles.grid}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle} data-reveal-delay="1">
                                Gallery
                            </h2>
                        </div>
                    </div>
                    <div className={styles.gallery}>
                        {project.mediaFiles.length >= 1 && (
                            <div
                                className={`${styles.galleryItem} ${styles.galleryItemLarge}`}
                                data-reveal
                                data-reveal-delay="1"
                            >
                                <Image
                                    src={project.mediaFiles[0]}
                                    alt={`${project.title} gallery 1`}
                                    width={1200}
                                    height={514}
                                />
                            </div>
                        )}
                        {project.mediaFiles.length > 1 && (
                            <div className={styles.galleryRow}>
                                {project.mediaFiles.slice(1).map((url, i) => (
                                    <div
                                        className={styles.galleryItem}
                                        data-reveal
                                        data-reveal-delay={String((i % 2) + 2)}
                                        key={i}
                                    >
                                        <Image
                                            src={url}
                                            alt={`${project.title} gallery ${i + 2}`}
                                            width={800}
                                            height={500}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

// ── Helpers ──

function extractIntro(description?: EditorJSDataBlock[]) {
    if (!description || typeof description === "string" || description.length === 0) {
        return { intro: null, restBlocks: [] as EditorJSDataBlock[] };
    }

    const first = description[0];
    if (first.type === EditorJSDataBlockTypesEnum.PARAGRAPH) {
        return {
            intro: stripHtml(first.data.text),
            restBlocks: description.slice(1),
        };
    }

    return { intro: null, restBlocks: description };
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, "");
}

// ── EditorJS Renderer ──

function EditorJSContent({ blocks }: { blocks: EditorJSDataBlock[] }) {
    return (
        <>
            {blocks.map((block, index) => {
                const key = block.id || `block-${index}`;
                switch (block.type) {
                    case EditorJSDataBlockTypesEnum.PARAGRAPH:
                        return (
                            <p
                                key={key}
                                className={styles.sectionText}
                                dangerouslySetInnerHTML={{ __html: block.data.text }}
                            />
                        );
                    case EditorJSDataBlockTypesEnum.HEADER:
                        return (
                            <h2 key={key} className={styles.sectionTitle}>
                                {block.data.text}
                            </h2>
                        );
                    case EditorJSDataBlockTypesEnum.LIST:
                        return (
                            <ul key={key} className={styles.contentList}>
                                {block.data.items.map((item, i) => (
                                    <li key={`${key}-item-${i}`}>{item.content}</li>
                                ))}
                            </ul>
                        );
                    case EditorJSDataBlockTypesEnum.IMAGE:
                        return (
                            <div key={key} className={styles.visualBlock} data-reveal>
                                <div className={styles.visualBlockFrame}>
                                    <Image
                                        src={block.data.file.url}
                                        alt={block.data.caption || ""}
                                        width={1600}
                                        height={900}
                                        className={styles.visualBlockImage}
                                    />
                                </div>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
}

// ── Expandable Text ──

function ExpandableText({ children }: { children: React.ReactNode }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`${styles.expandableText} ${expanded ? styles.expanded : ""}`}>
            <div className={styles.expandableTextHidden}>{children}</div>
            <button
                className={styles.expandableTextTrigger}
                aria-expanded={expanded}
                onClick={() => setExpanded(!expanded)}
            >
                <span className={styles.expandableTextTriggerText}>
                    {expanded ? "Read less" : "Read more"}
                </span>
                <span className={styles.expandableTextTriggerIcon} aria-hidden="true" />
            </button>
        </div>
    );
}

// ── Reveal Animation Hook ──

function useRevealAnimations() {
    useEffect(() => {
        const revealed = new Set<Element>();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || revealed.has(entry.target)) return;
                    revealed.add(entry.target);
                    entry.target.classList.add("revealed");
                });
            },
            {
                rootMargin: "0px 0px -80px 0px",
                threshold: 0.05,
            }
        );

        document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}
