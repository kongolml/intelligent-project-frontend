"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "../../../types/portfolio.types";
import styles from "./PortfolioCaseStudyV2.module.scss";
import CaseStudyNav, { NavSection } from "./CaseStudyNav";
import { useRevealOnScroll } from "@/app/hooks/useRevealOnScroll";
import { useHeroEntry } from "@/app/hooks/useHeroEntry";

const NAV_SECTIONS: NavSection[] = [
    { id: "hero",      label: "Intro",      index: "01" },
    { id: "about",     label: "About",      index: "02" },
    { id: "concept",   label: "Concept",    index: "03" },
    { id: "process",   label: "Exploration", index: "04" },
    { id: "packaging", label: "Packaging",  index: "05" },
    { id: "type",      label: "Typography", index: "06" },
];

interface ProjectDetailClientV2Props {
    project: PortfolioItem;
}

export default function ProjectDetailClientV2({ project }: ProjectDetailClientV2Props) {
    useRevealOnScroll({ selector: "[data-reveal], .reveal, .reveal-line" });
    useHeroEntry({ selector: ".hero .reveal-line, .hero .reveal" });
    useScrollRounding();

    const heroLabel =
        project.categories.length > 0
            ? project.categories.map((c) => c.name).join(" / ")
            : "Brand Identity & Packaging";

    const clientName = project.client ?? "Client";

    const ourTaskHTML = project.descriptionHTML || null;
    const clientGoalHTML = project.client_goalHTML || null;

    const [titleLine1, titleLine2] = splitTitle(project.title);

    // Packaging images from final_result_gallery
    const finalResultGalleryImages = project.final_result_gallery ?? [];

    return (
        <div className={styles.casePage}>
            <CaseStudyNav sections={NAV_SECTIONS} />

            {/* ─── HERO ─── */}
            <section id="hero" className={styles.hero}>
                <div
                    className={`${styles.heroBg} ${project.main_image ? styles.heroBgWithImage : ""}`}
                    style={project.main_image ? { viewTransitionName: `thumb-${project.id}` } : undefined}
                >
                    {project.main_image && (
                        <Image
                            src={project.main_image}
                            alt={project.title}
                            fill
                            className={styles.heroBgImage}
                            priority
                        />
                    )}
                    <div className={styles.heroGrid} />
                </div>

                <div className={styles.heroContent}>
                    <div className="reveal-line">
                        <span className={styles.heroLabel}>{heroLabel}</span>
                    </div>
                    <h1 className={styles.heroH1}>
                        <span className="reveal-line">
                            <span>{titleLine1}</span>
                        </span>
                        {titleLine2 && (
                            <>
                                <br />
                                <span className="reveal-line">
                                    <span>{titleLine2}</span>
                                </span>
                            </>
                        )}
                    </h1>
                    <dl className={styles.heroMeta}>
                        {project.client && (
                            <div className="reveal" style={{ transitionDelay: "0.3s" }}>
                                <dt>Client</dt>
                                <dd>{project.client}</dd>
                            </div>
                        )}
                        {project.year && (
                            <div className="reveal" style={{ transitionDelay: "0.4s" }}>
                                <dt>Year</dt>
                                <dd>{project.year}</dd>
                            </div>
                        )}
                        <div className="reveal" style={{ transitionDelay: "0.5s" }}>
                            <dt>Scope</dt>
                            <dd>Identity, Naming, Packaging</dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* ─── ABOUT ─── */}
            <section id="about" className={styles.about}>
                <div className={`${styles.aboutLeft} reveal`}>
                    <div className={styles.aboutLabel}>Client</div>
                    <h2 className={styles.aboutHeading}>{clientName}</h2>
                </div>

                <div className={styles.aboutRight}>
                    {ourTaskHTML && (
                        <div
                            className={`${styles.aboutDetail} reveal`}
                            style={{ transitionDelay: "0.1s" }}
                        >
                            <h4>Our Task</h4>
                            <div dangerouslySetInnerHTML={{ __html: ourTaskHTML }} />
                        </div>
                    )}
                    {clientGoalHTML && (
                        <div
                            className={`${styles.aboutDetail} reveal`}
                            style={{ transitionDelay: "0.2s" }}
                        >
                            <h4>Client Goal</h4>
                            <div dangerouslySetInnerHTML={{ __html: clientGoalHTML }} />
                        </div>
                    )}
                    {project.categories.length > 0 && (
                        <div
                            className={`${styles.aboutDetail} reveal`}
                            style={{ transitionDelay: "0.3s" }}
                        >
                            <h4>Disciplines</h4>
                            <div className={styles.tagList}>
                                {project.categories.map((cat) => (
                                    <span key={cat.slug} className={styles.tag}>
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── CONCEPT + MOODBOARD ─── */}
            <section id="concept" className={styles.conceptSection}>
                <div className={`${styles.conceptFields} reveal`}>
                    <div className={styles.conceptField}>
                        <label>Concept</label>
                        <p>
                            Noble heritage — referencing European ceramic and cartographic
                            traditions to signal provenance and craft.
                        </p>
                    </div>
                    <div className={styles.conceptField}>
                        <label>Values</label>
                        <p>Authenticity · Craft · Heritage · Distinction</p>
                    </div>
                    <div className={styles.conceptField}>
                        <label>Tone of Voice</label>
                        <p>
                            Confident, understated, with a sense of tradition. Speaks with
                            authority, not volume.
                        </p>
                    </div>
                    <div className={styles.conceptField}>
                        <label>Tagline</label>
                        <p>Noble by nature.</p>
                    </div>
                </div>

                {(project.visual_inspiration ?? []).length > 0 && (
                    <div className="reveal" style={{ transitionDelay: "0.15s" }}>
                        <div className={styles.moodboardLabel}>Visual Inspiration</div>
                        <div className={styles.moodboardGrid}>
                            {(project.visual_inspiration ?? []).map((url, i) => (
                                <div key={i} className={styles.moodImg}>
                                    <Image
                                        src={url}
                                        alt={`${project.title} — visual exploration ${i + 1}`}
                                        fill
                                        className={styles.coverImage}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ─── LOGO EXPLORATION ─── */}
            {(project.visual_exploration ?? []).length > 0 && (
                <section id="process" className={styles.processSection}>
                    <div className={`${styles.processHeader} reveal`}>
                        <h2>Logo &amp; Visual Exploration</h2>
                        <span className={styles.stepCount}>ref...</span>
                    </div>

                    {(() => {
                        const imgs = project.visual_exploration!;
                        const rows: string[][] = [];
                        for (let i = 0; i < imgs.length; i += 3) rows.push(imgs.slice(i, i + 3));
                        return rows.map((row, rowIdx) => (
                            <div
                                key={rowIdx}
                                className={`${styles.iterationRow} reveal`}
                                style={rowIdx > 0 ? { transitionDelay: `${rowIdx * 0.1}s` } : undefined}
                            >
                                {row.map((url, colIdx) => {
                                    const isLast = rowIdx === rows.length - 1 && colIdx === row.length - 1;
                                    return (
                                        <div key={colIdx} className={`${styles.iterationCard} ${isLast ? styles.iterationCardFinal : ""}`}>
                                            <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio43}`}>
                                                <Image
                                                    src={url}
                                                    alt={`${project.title} — logo exploration ${rowIdx * 3 + colIdx + 1}`}
                                                    fill
                                                    className={styles.coverImage}
                                                />
                                            </div>
                                            {isLast && <div className={styles.iterationLabel}>Selected</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        ));
                    })()}
                </section>
            )}

            {/* ─── NAME STEP ─── */}
            <section className={styles.processSection} style={{ paddingTop: "60px" }}>
                <div className={styles.processStep}>
                    <div className={`${styles.stepSidebar} reveal`}>
                        <div className={styles.stepNumber}>N</div>
                        <div className={styles.stepTitle}>Name</div>
                    </div>
                    <div className={styles.stepContent}>
                        <p
                            className={`${styles.stepText} reveal`}
                            style={{ transitionDelay: "0.1s" }}
                        >
                            <em>Noble</em> — a direct, one-word name that signals premium
                            positioning. Derived from the concept of noble heritage and noble
                            ingredients.
                        </p>
                        <ExpandableSection title="3 initial concepts evaluated">
                            <strong>Noble</strong> — selected for directness and pan-European
                            readability.<br />
                            <strong>Provenance</strong> — too literal, lacked shelf presence.
                            <br />
                            <strong>Cérami</strong> — too abstract, required explanation.
                        </ExpandableSection>

                        {/* Name lockup image pair */}
                        <div
                            className={`${styles.imagePair} reveal`}
                            style={{ transitionDelay: "0.15s" }}
                        >
                            <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio1}`}>
                                <div className={styles.mockLight} />
                            </div>
                            <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio1}`}>
                                <div className={styles.mockDark} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PACKAGING ─── */}
            {finalResultGalleryImages.length > 0 && (
                <section id="packaging" className={styles.processSection} style={{ paddingTop: "40px" }}>
                    <div className={`${styles.processHeader} reveal`}>
                        <h2>Packaging</h2>
                    </div>

                    {(() => {
                        const pairs: string[][] = [];
                        for (let i = 0; i < finalResultGalleryImages.length; i += 2) pairs.push(finalResultGalleryImages.slice(i, i + 2));
                        return pairs.map((pair, pairIdx) => (
                            <div key={pairIdx}>
                                {pairIdx > 0 && <div style={{ height: "24px" }} />}
                                <div
                                    className={`${styles.imagePair} reveal`}
                                    style={pairIdx > 0 ? { transitionDelay: `${pairIdx * 0.1}s` } : undefined}
                                >
                                    {pair.map((url, colIdx) => (
                                        <div key={colIdx} className={`${styles.imgWrapper} ${styles.imgWrapperRatio1}`}>
                                            <Image
                                                src={url}
                                                alt={`${project.title} — packaging ${pairIdx * 2 + colIdx + 1}`}
                                                fill
                                                className={styles.coverImage}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ));
                    })()}
                </section>
            )}

            {/* ─── TYPOGRAPHY SECTION ─── */}
            <section id="type" className={`${styles.typeSection} reveal`}>
                <div className={styles.typeLabel}>Typography</div>
                <p className={styles.typeDesc}>
                    The primary typeface is a transitional serif, chosen for its historical
                    resonance with 18th-century European printing — connecting the visual
                    system to the product&apos;s heritage. Secondary type is a restrained
                    geometric sans for functional information and ingredient lists.
                </p>
            </section>

            {/* ─── STATEMENT ─── */}
            <div className={`${styles.textBand} reveal`}>
                <blockquote>Text.</blockquote>
            </div>

            {/* ─── NEXT PROJECT ─── */}
            <Link href="/projects" className={styles.nextProject}>
                <div>
                    <div className={styles.nextLabel}>Related Project</div>
                    <h3 className={styles.nextHeading}>Nordisk Kaffebar</h3>
                </div>
                <div className={styles.nextArrow}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M4 10H16M16 10L11 5M16 10L11 15"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </svg>
                </div>
            </Link>
        </div>
    );
}


// ── Helpers ──

function splitTitle(title: string): [string, string] {
    const words = title.trim().split(/\s+/);
    if (words.length === 1) return [title, ""];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

// ── Expandable Section ──

interface ExpandableSectionProps {
    title: string;
    children: React.ReactNode;
}

function ExpandableSection({ title, children }: ExpandableSectionProps) {
    const [open, setOpen] = useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    const toggle = () => {
        const body = bodyRef.current;
        const inner = innerRef.current;
        if (!body || !inner) return;
        body.style.maxHeight = open ? "0" : `${inner.scrollHeight}px`;
        setOpen(!open);
    };

    return (
        <div className={`${styles.expandable} ${open ? styles.expandableOpen : ""}`}>
            <div
                className={styles.expandTrigger}
                onClick={toggle}
                role="button"
                aria-expanded={open}
            >
                <h4>{title}</h4>
                <div className={styles.expandIcon} aria-hidden="true" />
            </div>
            <div
                className={styles.expandBody}
                ref={bodyRef}
                style={{ maxHeight: 0, overflow: "hidden" }}
            >
                <div className={styles.expandBodyInner} ref={innerRef}>
                    {children}
                </div>
            </div>
        </div>
    );
}


// ── Scroll-linked Hero Rounding Hook ──
// As the user scrolls past the hero, it dramatically rounds its bottom corners
// and shrinks slightly, creating a "card lifting off the page" effect.

function useScrollRounding() {
    useEffect(() => {
        const hero = document.getElementById('hero');
        if (!hero) return;

        let ticking = false;

        const heroH = hero.offsetHeight;
        const maxRadius = window.innerWidth <= 768 ? 36 : 60;

        const update = () => {
            const progress = Math.max(0, Math.min(1, window.scrollY / (heroH * 0.4)));
            const radius = Math.round(progress * maxRadius);
            const scale = 1 - progress * 0.03;

            hero.style.borderRadius = `0 0 ${radius}px ${radius}px`;
            hero.style.transform = `scale(${scale})`;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    update();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        update();

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);
}
