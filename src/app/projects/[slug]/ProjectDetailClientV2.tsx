"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "../../../types/portfolio.types";
import styles from "./PortfolioCaseStudyV2.module.scss";
import CaseStudyNav, { NavSection } from "./CaseStudyNav";

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
    useRevealAnimations();
    useHeroAnimations();
    useScrollRounding();

    const heroLabel =
        project.categories.length > 0
            ? project.categories.map((c) => c.name).join(" / ")
            : "Brand Identity & Packaging";

    const clientName = project.client ?? "Client";

    const ourTaskHTML = project.our_taskHTML || null;
    const clientGoalHTML = project.client_goalHTML || null;

    const [titleLine1, titleLine2] = splitTitle(project.title);

    // Packaging image slots
    const packImg0 = project.mediaFiles[0] ?? null;
    const packImg1 = project.mediaFiles[1] ?? null;
    const packImg2 = project.mediaFiles[2] ?? null;
    const packImg3 = project.mediaFiles[3] ?? null;
    const packFinalA = project.mediaFiles[4] ?? null;
    const packFinalB = project.mediaFiles[5] ?? null;

    return (
        <div className={styles.casePage}>
            <CaseStudyNav sections={NAV_SECTIONS} />

            {/* ─── HERO ─── */}
            <section id="hero" className={styles.hero}>
                <div
                    className={`${styles.heroBg} ${project.thumbnail ? styles.heroBgWithImage : ""}`}
                    style={project.thumbnail ? { viewTransitionName: `thumb-${project.id}` } : undefined}
                >
                    {project.thumbnail && (
                        <Image
                            src={project.thumbnail}
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
                    <div
                        className={`${styles.aboutDetail} reveal`}
                        style={{ transitionDelay: "0.1s" }}
                    >
                        <h4>Our Task</h4>
                        {ourTaskHTML ? (
                            <div dangerouslySetInnerHTML={{ __html: ourTaskHTML }} />
                        ) : null}
                    </div>
                    <div
                        className={`${styles.aboutDetail} reveal`}
                        style={{ transitionDelay: "0.2s" }}
                    >
                        <h4>Client Goal</h4>
                        {clientGoalHTML ? (
                            <div dangerouslySetInnerHTML={{ __html: clientGoalHTML }} />
                        ) : null}
                    </div>
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
                            {project.categories.length === 0 && (
                                <>
                                    <span className={styles.tag}>Brand Strategy</span>
                                    <span className={styles.tag}>Naming</span>
                                    <span className={styles.tag}>Visual Identity</span>
                                    <span className={styles.tag}>Packaging</span>
                                    <span className={styles.tag}>Art Direction</span>
                                </>
                            )}
                        </div>
                    </div>
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

                <div className="reveal" style={{ transitionDelay: "0.15s" }}>
                    <div className={styles.moodboardLabel}>Visual Inspiration</div>
                    <div className={styles.moodboardGrid}>
                        {(project.visual_inspiration ?? []).length > 0
                            ? (project.visual_inspiration ?? []).map((url, i) => (
                                <div key={i} className={styles.moodImg}>
                                    <Image
                                        src={url}
                                        alt={`${project.title} — visual exploration ${i + 1}`}
                                        fill
                                        className={styles.coverImage}
                                    />
                                </div>
                            ))
                            : (
                                <>
                                    <div className={`${styles.moodImg} ${styles.moodBlue}`} />
                                    <div className={`${styles.moodImg} ${styles.moodCream}`} />
                                    <div className={`${styles.moodImg} ${styles.moodTeal}`} />
                                    <div className={`${styles.moodImg} ${styles.moodWarm}`} />
                                </>
                            )
                        }
                    </div>
                </div>
            </section>

            {/* ─── LOGO EXPLORATION ─── */}
            <section id="process" className={styles.processSection}>
                <div className={`${styles.processHeader} reveal`}>
                    <h2>Logo &amp; Visual Exploration</h2>
                    <span className={styles.stepCount}>ref...</span>
                </div>

                {(project.visual_exploration ?? []).length > 0 ? (
                    (() => {
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
                    })()
                ) : (
                    <>
                        {/* Row 1 */}
                        <div className={`${styles.iterationRow} reveal`}>
                            <div className={styles.iterationCard}>
                                <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio43}`}>
                                    <div className={styles.mockLight} />
                                </div>
                            </div>
                            <div className={styles.iterationCard}>
                                <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio43}`}>
                                    <div className={styles.mockBlue} />
                                </div>
                            </div>
                            <div className={styles.iterationCard}>
                                <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio43}`}>
                                    <div className={styles.mockCream} />
                                </div>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className={`${styles.iterationRow} reveal`} style={{ transitionDelay: "0.1s" }}>
                            <div className={styles.iterationCard}>
                                <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio43}`}>
                                    <div className={styles.mockStone} />
                                </div>
                            </div>
                            <div className={styles.iterationCard}>
                                <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio43}`}>
                                    <div className={styles.mockTeal} />
                                </div>
                            </div>
                            <div className={`${styles.iterationCard} ${styles.iterationCardFinal}`}>
                                <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio43}`}>
                                    <div className={styles.mockSand} />
                                </div>
                                <div className={styles.iterationLabel}>Selected</div>
                            </div>
                        </div>
                    </>
                )}
            </section>

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
            <section id="packaging" className={styles.processSection} style={{ paddingTop: "40px" }}>
                <div className={`${styles.processHeader} reveal`}>
                    <h2>Packaging</h2>
                </div>

                {/* Pair 1 */}
                <div className={`${styles.imagePair} reveal`}>
                    <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio1}`}>
                        {packImg0 ? (
                            <Image
                                src={packImg0}
                                alt={`${project.title} — packaging label cream`}
                                fill
                                className={styles.coverImage}
                            />
                        ) : (
                            <div className={styles.mockCream} />
                        )}
                    </div>
                    <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio1}`}>
                        {packImg1 ? (
                            <Image
                                src={packImg1}
                                alt={`${project.title} — packaging label blue`}
                                fill
                                className={styles.coverImage}
                            />
                        ) : (
                            <div className={styles.mockBlue} />
                        )}
                    </div>
                </div>

                <div style={{ height: "24px" }} />

                {/* Pair 2 */}
                <div className={`${styles.imagePair} reveal`} style={{ transitionDelay: "0.1s" }}>
                    <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio1}`}>
                        {packImg2 ? (
                            <Image
                                src={packImg2}
                                alt={`${project.title} — packaging detail warm`}
                                fill
                                className={styles.coverImage}
                            />
                        ) : (
                            <div className={styles.mockWarm} />
                        )}
                    </div>
                    <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio1}`}>
                        {packImg3 ? (
                            <Image
                                src={packImg3}
                                alt={`${project.title} — packaging detail teal`}
                                fill
                                className={styles.coverImage}
                            />
                        ) : (
                            <div className={styles.mockTeal} />
                        )}
                    </div>
                </div>

                <div style={{ height: "24px" }} />

                {/* Final 16:10 pair */}
                <div
                    className={`${styles.imagePair} reveal`}
                    style={{ transitionDelay: "0.15s" }}
                >
                    <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio1610}`}>
                        {packFinalA ? (
                            <Image
                                src={packFinalA}
                                alt={`${project.title} — product final dark`}
                                fill
                                className={styles.coverImage}
                            />
                        ) : (
                            <div className={styles.mockDark} />
                        )}
                    </div>
                    <div className={`${styles.imgWrapper} ${styles.imgWrapperRatio1610}`}>
                        {packFinalB ? (
                            <Image
                                src={packFinalB}
                                alt={`${project.title} — product final deep`}
                                fill
                                className={styles.coverImage}
                            />
                        ) : (
                            <div className={styles.mockDeep} />
                        )}
                    </div>
                </div>
            </section>

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


// ── Reveal Animation Hook ──

function useRevealAnimations() {
    useEffect(() => {
        const revealed = new Set<Element>();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || revealed.has(entry.target)) return;
                    revealed.add(entry.target);
                    if (entry.target.hasAttribute("data-reveal")) {
                        entry.target.classList.add("revealed");
                    }
                    if (
                        entry.target.classList.contains("reveal") ||
                        entry.target.classList.contains("reveal-line")
                    ) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            {
                rootMargin: "0px 0px -80px 0px",
                threshold: 0.05,
            }
        );

        document
            .querySelectorAll("[data-reveal], .reveal, .reveal-line")
            .forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}


// ── Hero Entry Animation Hook ──

function useHeroAnimations() {
    useEffect(() => {
        const heroElements = document.querySelectorAll(
            ".hero .reveal-line, .hero .reveal"
        );
        heroElements.forEach((el, i) => {
            setTimeout(() => el.classList.add("visible"), 200 + i * 150);
        });
    }, []);
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
