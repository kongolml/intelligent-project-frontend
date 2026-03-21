"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PortfolioItemSpinner from "@/app/components/PortfolioList/PortfolioItemSpinner";

// types
import { PortfolioCategory, PortfolioItem } from "@/types/portfolio.types";

import Image from "@/app/components/common/Image";

// styles
import styles from "./PortfolioList.module.scss";

interface PortfolioListProps {
	portfolioItems: PortfolioItem[];
	portfolioCategories: PortfolioCategory[];
}

export default function PortfolioList({ portfolioItems, portfolioCategories }: PortfolioListProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const initialCategory = searchParams.get("category") || "all";
	const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
	const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

	const gridRef = useRef<HTMLDivElement>(null);

	const filteredItems = useMemo(() => {
		return selectedCategory === "all"
			? portfolioItems
			: portfolioItems.filter((item) => item.categories.some((cat) => cat.slug === selectedCategory));
	}, [portfolioItems, selectedCategory]);

	const categoryCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		portfolioItems.forEach((item) => {
			item.categories.forEach((cat) => {
				counts[cat.slug] = (counts[cat.slug] || 0) + 1;
			});
		});
		return counts;
	}, [portfolioItems]);

	useEffect(() => {
		setSelectedCategory(initialCategory);
	}, [initialCategory]);

	const handleCategoryChange = useCallback(
		(category: string) => {
			category === "all"
				? router.replace(window.location.pathname, { scroll: false })
				: router.replace(`?category=${category}`, { scroll: false });
			setSelectedCategory(category);
		},
		[router]
	);

	// IntersectionObserver for reveal animations
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add(styles.visible);
					}
				});
			},
			{ threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
		);

		const revealElements = gridRef.current?.querySelectorAll(`.${styles.reveal}`);
		revealElements?.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, [filteredItems]);

	return (
		<>
			{/* ── Hero ── */}
			<section className={styles.hero}>
				<div className={styles.heroInner}>
					<div className={styles.heroLabel}>
						<span className={styles.accentLine} />
						Selected Work
					</div>
					<h1 className={styles.heroTitle}>Projects</h1>
					<div className={styles.heroMeta}>
						<span className={styles.metaCount}>{portfolioItems.length} projects</span>
						<span className={styles.metaDivider} />
						<span className={styles.metaCategories}>
							{portfolioCategories.map((c) => c.name).join(" / ")}
						</span>
					</div>
				</div>
			</section>

			{/* ── Filter Bar ── */}
			<div className={styles.filterBar}>
				<div className={styles.filterInner}>
					<button
						className={`${styles.filterBtn} ${selectedCategory === "all" ? styles.filterActive : ""}`}
						onClick={() => handleCategoryChange("all")}
					>
						All <span className={styles.filterCount}>{portfolioItems.length}</span>
					</button>
					{portfolioCategories.map((category) => (
						<button
							key={category.slug}
							className={`${styles.filterBtn} ${selectedCategory === category.slug ? styles.filterActive : ""}`}
							onClick={() => handleCategoryChange(category.slug)}
						>
							{category.name}{" "}
							<span className={styles.filterCount}>{categoryCounts[category.slug] || 0}</span>
						</button>
					))}
				</div>
			</div>

			{/* ── Project Grid ── */}
			<section className={styles.gridSection} ref={gridRef}>
				<div className={styles.projectGrid}>
					{filteredItems.map((item, index) => (
						<Link
							href={`/projects/${item.slug}`}
							key={item.id}
							className={`${styles.projectCard} ${styles.reveal}`}
							style={{ transitionDelay: `${(index % 4) * 0.1}s` }}
							onClick={() => setLoadingSlug(item.slug)}
						>
							<div className={styles.cardImageWrap} style={{ viewTransitionName: `thumb-${item.id}` }}>
								{item.thumbnail && (
									<Image
										src={item.thumbnail}
										alt={item.title}
										fill
										className={styles.cardImage}
										sizes="(min-width: 1200px) 45vw, (min-width: 768px) 50vw, 90vw"
									/>
								)}
								{loadingSlug === item.slug && <PortfolioItemSpinner />}
								<div className={styles.cardOverlay} />
							</div>
							<div className={styles.cardInfo}>
								<div className={styles.cardMeta}>
									<span className={styles.cardCategories}>
										{item.categories.map((c) => c.name).join(" / ")}
									</span>
									{item.year && <span className={styles.cardYear}>{item.year}</span>}
								</div>
								<h2 className={styles.cardTitle}>{item.title}</h2>
								{item.subtitle && <p className={styles.cardSubtitle}>{item.subtitle}</p>}
							</div>
							<div className={styles.cardArrow}>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1" />
								</svg>
							</div>
						</Link>
					))}
				</div>
			</section>
		</>
	);
}
