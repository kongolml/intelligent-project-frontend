"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "../../../types/portfolio.types";
import { sanitizeHtml } from "../../lib/sanitize";
import styles from "./PortfolioCaseStudy.module.scss";

interface ProjectDetailClientProps {
    project: PortfolioItem;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
    useRevealAnimations();
    useHeroAnimations();

    const heroLabel =
        project.categories.length > 0
            ? project.categories.map((c) => c.name).join(" / ")
            : "Brand Identity";

    const aboutH2 =
        project.subtitle ??
        "Redefining organic food through design that feels alive";

    const aboutBrief = project.descriptionHTML
        ? sanitizeHtml(project.descriptionHTML)
        : null;

    const [titleLine1, titleLine2] = splitTitle(project.title);

    // Image slot assignments from mediaFiles
    const fullImage = project.mediaFiles[0] ?? null;
    const step1ImageA = project.mediaFiles[1] ?? null;
    const step1ImageB = project.mediaFiles[2] ?? null;
    const step3ImageA = project.mediaFiles[3] ?? null;
    const step3ImageB = project.mediaFiles[4] ?? null;
    const fragmentImages = project.mediaFiles.slice(5, 8);
    const finalFullImage =
        project.mediaFiles[8] ?? project.mediaFiles[5] ?? null;

    return (
        <div className={styles.casePage}>
            {/* ─── HERO ─── */}
            <section className={styles.hero}>
                <div
                    className={`${styles.heroBg} ${project.thumbnail ? styles.heroBgWithImage : ""}`}
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
                            <dd>Identity, Packaging, Digital</dd>
                        </div>
                        <div className="reveal" style={{ transitionDelay: "0.6s" }}>
                            <dt>Timeline</dt>
                            <dd>14 Weeks</dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* ─── ABOUT ─── */}
            <section className={styles.about}>
                <div className={`${styles.aboutLeft} reveal`}>
                    <div className={styles.aboutLabel}>About the project</div>
                    <h2 className={styles.aboutHeading}>{aboutH2}</h2>
                    {aboutBrief ? (
                        <p
                            className={styles.aboutBrief}
                            dangerouslySetInnerHTML={{ __html: aboutBrief }}
                        />
                    ) : (
                        <p className={styles.aboutBrief}>
                            Terraverde came to us with a clear ambition: position their line of
                            organic sauces as a premium, design-forward brand in a market
                            saturated with clichéd &quot;natural&quot; aesthetics. We developed an identity
                            system that balances earthiness with sophistication.
                        </p>
                    )}
                </div>

                <div className={styles.aboutRight}>
                    <div
                        className={`${styles.aboutDetail} reveal`}
                        style={{ transitionDelay: "0.1s" }}
                    >
                        <h4>Challenge</h4>
                        <p>
                            Break free from the visual conventions of organic food branding —
                            kraft paper, hand-drawn illustrations, green-washed imagery — while
                            maintaining authenticity and shelf appeal.
                        </p>
                    </div>
                    <div
                        className={`${styles.aboutDetail} reveal`}
                        style={{ transitionDelay: "0.2s" }}
                    >
                        <h4>Approach</h4>
                        <p>
                            We treated the packaging as editorial design. Each label tells a
                            micro-story about the ingredient origin, using typographic hierarchy
                            and restrained color to create shelf differentiation.
                        </p>
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
                            {project.categories.length < 3 && (
                                <>
                                    <span className={styles.tag}>Art Direction</span>
                                    <span className={styles.tag}>Web Design</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FULL IMAGE 16:9 ─── */}
            <div className={`${styles.fullImage} reveal`}>
                {fullImage ? (
                    <div
                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio169}`}
                    >
                        <Image
                            src={fullImage}
                            alt={`${project.title} — overview`}
                            fill
                            className={styles.coverImage}
                        />
                    </div>
                ) : (
                    <div
                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio169} ${styles.imgPlaceholder}`}
                    />
                )}
            </div>

            {/* ─── PROCESS ─── */}
            <section className={styles.processSection}>
                <div className={`${styles.processHeader} reveal`}>
                    <h2>Design Process</h2>
                    <span className={styles.stepCount}>04 Phases</span>
                </div>

                {/* Step 1: Research */}
                <div className={styles.processStep}>
                    <div className={`${styles.stepSidebar} reveal`}>
                        <div className={styles.stepNumber}>01</div>
                        <div className={styles.stepTitle}>Research &amp; Discovery</div>
                        <div className={styles.stepSubtitle}>Weeks 1–3</div>
                    </div>
                    <div className={styles.stepContent}>
                        <p
                            className={`${styles.stepText} reveal`}
                            style={{ transitionDelay: "0.1s" }}
                        >
                            We started with an extensive audit of the organic food category
                            across European and North American markets. The visual landscape was
                            remarkably homogenous — earth tones, serif fonts, pastoral imagery.
                            We identified a gap: no brand owned a position that was both
                            authentically organic and visually contemporary.
                        </p>
                        <ExpandableSection
                            title="Competitive Audit Findings"
                        >
                            We analyzed 47 brands across 6 markets. Key insight: 89% used green
                            as their primary brand color. 73% featured illustrations of plants or
                            farms. Only 4 brands used a modernist design language, and none were
                            in the sauce/condiment category. This white space became our
                            strategic foundation.
                        </ExpandableSection>
                        <ExpandableSection title="Consumer Interviews">
                            12 in-depth interviews with target consumers (25–40, urban,
                            design-conscious). Recurring theme: they wanted organic products they
                            wouldn&apos;t feel embarrassed to leave on the counter during a dinner
                            party. Design quality was a direct proxy for product quality in their
                            mental model.
                        </ExpandableSection>

                        {(step1ImageA || step1ImageB) && (
                            <div
                                className={`${styles.imagePair} ${styles.imagePairOffset} reveal`}
                                style={{ transitionDelay: "0.15s" }}
                            >
                                {step1ImageA ? (
                                    <div
                                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio45}`}
                                    >
                                        <Image
                                            src={step1ImageA}
                                            alt="Research moodboard — typography"
                                            fill
                                            className={styles.coverImage}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio45} ${styles.imgPlaceholder}`}
                                    />
                                )}
                                {step1ImageB ? (
                                    <div
                                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio45}`}
                                    >
                                        <Image
                                            src={step1ImageB}
                                            alt="Research moodboard — texture"
                                            fill
                                            className={styles.coverImage}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio45} ${styles.imgPlaceholder}`}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 2: Concept */}
                <div className={styles.processStep}>
                    <div className={`${styles.stepSidebar} reveal`}>
                        <div className={styles.stepNumber}>02</div>
                        <div className={styles.stepTitle}>Concept Development</div>
                        <div className={styles.stepSubtitle}>Weeks 3–6</div>
                    </div>
                    <div className={styles.stepContent}>
                        <p
                            className={`${styles.stepText} reveal`}
                            style={{ transitionDelay: "0.1s" }}
                        >
                            Three distinct directions were developed, each offering a different
                            strategic position. Direction C — &quot;Editorial Terroir&quot; — was selected
                            for its ability to differentiate at shelf while scaling across the
                            full product range.
                        </p>
                        <ExpandableSection title='Direction A — "Rooted Modernism"'>
                            Geometric abstraction of botanical forms. Strong grid system. Limited
                            to black, white, and one accent color per SKU. Rejected for feeling
                            too cold — lacked the warmth needed for a food brand.
                        </ExpandableSection>
                        <ExpandableSection title='Direction B — "Handcraft Redux"'>
                            Refined hand-drawn elements paired with contemporary typography.
                            Textured paper stocks. Rejected because, despite the quality of
                            execution, it still read as &quot;artisanal&quot; at first glance — exactly the
                            territory we needed to avoid.
                        </ExpandableSection>
                        <ExpandableSection title='Direction C — "Editorial Terroir" ✓'>
                            Magazine-inspired layouts on packaging. Strong typographic voice.
                            Each label structured like an editorial page — headline, body, and a
                            single macro photograph of the hero ingredient. The design system
                            allowed infinite variation within tight constraints.
                        </ExpandableSection>

                        {/* Iteration comparison — static design element */}
                        <div
                            className={`${styles.iterationRow} reveal`}
                            style={{ transitionDelay: "0.15s" }}
                        >
                            <div className={styles.iterationCard}>
                                <div
                                    className={`${styles.imgWrapper} ${styles.imgWrapperRatio34}`}
                                >
                                    <div className={styles.iterationPlaceholder1} />
                                </div>
                                <div className={styles.iterationLabel}>Direction A</div>
                                <div className={styles.iterationDesc}>
                                    Rooted Modernism — too cold for food context
                                </div>
                            </div>
                            <div className={styles.iterationCard}>
                                <div
                                    className={`${styles.imgWrapper} ${styles.imgWrapperRatio34}`}
                                >
                                    <div className={styles.iterationPlaceholder2} />
                                </div>
                                <div className={styles.iterationLabel}>Direction B</div>
                                <div className={styles.iterationDesc}>
                                    Handcraft Redux — still read as &quot;artisanal&quot;
                                </div>
                            </div>
                            <div className={`${styles.iterationCard} ${styles.iterationCardFinal}`}>
                                <div
                                    className={`${styles.imgWrapper} ${styles.imgWrapperRatio34}`}
                                >
                                    <div className={styles.iterationPlaceholder3} />
                                </div>
                                <div className={styles.iterationLabel}>Selected → Direction C</div>
                                <div className={styles.iterationDesc}>
                                    Editorial Terroir — differentiation + scalability
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 3: Refinement */}
                <div className={styles.processStep}>
                    <div className={`${styles.stepSidebar} reveal`}>
                        <div className={styles.stepNumber}>03</div>
                        <div className={styles.stepTitle}>Design Refinement</div>
                        <div className={styles.stepSubtitle}>Weeks 6–10</div>
                    </div>
                    <div className={styles.stepContent}>
                        <p
                            className={`${styles.stepText} reveal`}
                            style={{ transitionDelay: "0.1s" }}
                        >
                            The selected direction went through four rounds of refinement. Each
                            iteration focused on a specific dimension: typographic hierarchy,
                            color calibration, material specification, and production
                            feasibility.
                        </p>
                        <ExpandableSection title="Typography Iterations">
                            We tested 14 typeface pairings before settling on the final
                            combination. The display face needed to carry editorial authority
                            without feeling corporate. The body face needed legibility at small
                            sizes on curved surfaces. Final selection: a custom-modified serif
                            for headlines paired with a geometric sans for supporting text.
                        </ExpandableSection>

                        {(step3ImageA || step3ImageB) && (
                            <div
                                className={`${styles.imagePair} reveal`}
                                style={{ transitionDelay: "0.15s" }}
                            >
                                {step3ImageA ? (
                                    <div
                                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio45}`}
                                    >
                                        <Image
                                            src={step3ImageA}
                                            alt="Packaging — Front label"
                                            fill
                                            className={styles.coverImage}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio45} ${styles.imgPlaceholder}`}
                                    />
                                )}
                                {step3ImageB ? (
                                    <div
                                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio45}`}
                                    >
                                        <Image
                                            src={step3ImageB}
                                            alt="Packaging — Back label"
                                            fill
                                            className={styles.coverImage}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio45} ${styles.imgPlaceholder}`}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 4: Production */}
                <div className={styles.processStep}>
                    <div className={`${styles.stepSidebar} reveal`}>
                        <div className={styles.stepNumber}>04</div>
                        <div className={styles.stepTitle}>Production &amp; Launch</div>
                        <div className={styles.stepSubtitle}>Weeks 10–14</div>
                    </div>
                    <div className={styles.stepContent}>
                        <p
                            className={`${styles.stepText} reveal`}
                            style={{ transitionDelay: "0.1s" }}
                        >
                            Final production involved close collaboration with the printer to
                            achieve the precise material finish. We specified an uncoated stock
                            with soft-touch lamination and a single pass of spot UV on the
                            logotype — enough tactile interest without tipping into
                            luxury-for-luxury&apos;s-sake territory.
                        </p>
                        <ExpandableSection title="Print Specifications">
                            4C process + 1 PMS (custom-mixed terracotta) on 350gsm GC1 board.
                            Soft-touch lamination full cover. Spot UV on logotype and ingredient
                            name only. Die-cut with no score lines visible on front face.
                            Adhesive: permanent repositionable for glass application.
                        </ExpandableSection>
                    </div>
                </div>
            </section>

            {/* ─── LARGE STATEMENT ─── */}
            <div className={`${styles.textBand} reveal`}>
                <blockquote>
                    &quot;The packaging doesn&apos;t just sit on the shelf — it starts a conversation
                    about what organic food design can be.&quot;
                </blockquote>
                <div className={styles.attribution}>— Marcus Holm, Creative Director</div>
            </div>

            {/* ─── DETAIL FRAGMENTS ─── */}
            <div className={styles.fragments}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={`${styles.fragment} reveal`}
                        style={{ transitionDelay: `${i * 0.1}s` }}
                    >
                        {fragmentImages[i] ? (
                            <div
                                className={`${styles.imgWrapper} ${styles.imgWrapperRatio1}`}
                                style={{ height: "100%" }}
                            >
                                <Image
                                    src={fragmentImages[i]}
                                    alt={`Detail ${i + 1}`}
                                    fill
                                    className={styles.coverImage}
                                />
                            </div>
                        ) : (
                            <div
                                className={
                                    styles[
                                        `fragmentPlaceholder${i + 1}` as keyof typeof styles
                                    ]
                                }
                                style={{ width: "100%", height: "100%" }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* ─── FULL WIDTH RESULT 21:9 ─── */}
            <div className={`${styles.fullImage} reveal`}>
                {finalFullImage ? (
                    <div
                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio219}`}
                    >
                        <Image
                            src={finalFullImage}
                            alt={`${project.title} — final result`}
                            fill
                            className={styles.coverImage}
                        />
                    </div>
                ) : (
                    <div
                        className={`${styles.imgWrapper} ${styles.imgWrapperRatio219} ${styles.imgPlaceholder}`}
                    />
                )}
            </div>

            {/* ─── OUTCOME ─── */}
            <section className={`${styles.outcome} reveal`}>
                <div className={styles.outcomeSectionLabel}>Results</div>
                <div className={styles.outcomeGrid}>
                    {[
                        {
                            number: "+340%",
                            label:
                                "Increase in social media engagement within 60 days of launch",
                        },
                        {
                            number: "12",
                            label:
                                "New retail partnerships secured based on packaging design alone",
                        },
                        {
                            number: "2×",
                            label:
                                "Shelf pickup rate compared to previous packaging in A/B test",
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className={`${styles.outcomeStat} reveal`}
                            style={{ transitionDelay: `${(i + 1) * 0.1}s` }}
                        >
                            <div className={styles.outcomeNumber}>{stat.number}</div>
                            <div className={styles.outcomeLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── NEXT PROJECT ─── */}
            <Link href="/projects" className={styles.nextProject}>
                <div>
                    <div className={styles.nextLabel}>Next Project</div>
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
        <div
            className={`${styles.expandable} ${open ? styles.expandableOpen : ""}`}
        >
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
