"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./CaseStudyNav.module.scss";

export interface NavSection {
    id: string;
    label: string;
    index: string; // e.g. "01", "02"
}

interface CaseStudyNavProps {
    sections: NavSection[];
}

export default function CaseStudyNav({ sections }: CaseStudyNavProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [heroVisible, setHeroVisible] = useState(true);
    const [indicatorY, setIndicatorY] = useState(0);
    const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const railRef = useRef<HTMLDivElement>(null);

    // Track which section is in view
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        sections.forEach((section, i) => {
            const el = document.getElementById(section.id);
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveIndex(i);
                    }
                },
                { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [sections]);

    // Track hero visibility for color inversion
    useEffect(() => {
        const hero = document.getElementById("hero");
        if (!hero) return;

        const observer = new IntersectionObserver(
            ([entry]) => setHeroVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        observer.observe(hero);
        return () => observer.disconnect();
    }, []);

    // Move indicator dot to match active dot position
    useEffect(() => {
        const activeDot = dotRefs.current[activeIndex];
        const rail = railRef.current;
        if (!activeDot || !rail) return;

        const railRect = rail.getBoundingClientRect();
        const dotRect = activeDot.getBoundingClientRect();
        const y = dotRect.top - railRect.top + dotRect.height / 2;
        setIndicatorY(y);
    }, [activeIndex]);

    const scrollTo = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <nav
            className={`${styles.rail} ${heroVisible ? styles.railDark : styles.railLight}`}
            aria-label="Case study sections"
        >
            <div className={styles.railInner} ref={railRef}>
                {/* The travelling red line indicator */}
                <div
                    className={styles.indicator}
                    style={{ transform: `translateY(${indicatorY}px)` }}
                    aria-hidden="true"
                >
                    <div className={styles.indicatorLine} />
                    <div className={styles.indicatorDot} />
                </div>

                {/* Section dots + labels */}
                <ul className={styles.sectionList}>
                    {sections.map((section, i) => (
                        <li key={section.id} className={styles.sectionItem}>
                            <button
                                ref={(el) => { dotRefs.current[i] = el; }}
                                className={`${styles.sectionBtn} ${i === activeIndex ? styles.sectionBtnActive : ""}`}
                                onClick={() => scrollTo(section.id)}
                                aria-label={`Go to ${section.label}`}
                                title={section.label}
                            >
                                <span className={styles.sectionIndex} aria-hidden="true">
                                    {section.index}
                                </span>
                                <span className={styles.sectionDot} aria-hidden="true" />
                                <span className={styles.sectionLabel}>
                                    {section.label}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Vertical spine line */}
                <div className={styles.spine} aria-hidden="true" />
            </div>
        </nav>
    );
}
