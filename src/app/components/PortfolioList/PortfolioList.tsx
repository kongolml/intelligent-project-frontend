"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

// types
import { PortfolioCategory, PortfolioItem } from "@/types/portfolio.types";

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

	const allItemsLength = portfolioItems.length;

	const filteredItems = useMemo(() => {
		return selectedCategory === "all"
			? portfolioItems
			: portfolioItems.filter((item) => item.categories.some((category) => category.slug === selectedCategory));
	}, [portfolioItems, selectedCategory]);

	// Create a map of category slug to count
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

	const handleCategoryChange = (category: string) => {
		category === "all" ? router.replace(window.location.pathname, { scroll: false }) : router.replace(`?category=${category}`, { scroll: false });
		setSelectedCategory(category);
	};

	return (
		<>
			<ul className={styles.categoriesList}>
				{/* <li onClick={() => handleCategoryChange("all")} className={selectedCategory === "all" ? styles.active : ""}>
					All<sup>{allItemsLength}</sup>
				</li> */}
				{portfolioCategories.map((category, index) => (
					<li
						key={category.slug}
						onClick={() => handleCategoryChange(category.slug)}
						className={selectedCategory === category.slug ? styles.active : ""}
					>
						{categoryCounts[category.slug] || 0} {category.name} {index !== portfolioCategories.length - 1 && <span>,</span>}
					</li>
				))}
        <li>Проектів</li>
			</ul>

			<div className={styles.projectsGrid}>
				{filteredItems.map((item) => (
					<Link href={`/projects/${item.slug}`} key={item.id}>
						<div className={styles.projectCard}>
							{item.thumbnail && (
								<div className={styles.imageWrap}>
									<Image
										src={item.thumbnail}
										alt={item.title}
										fill
										className={styles.projectImg}
										sizes="(min-width: 1200px) 33vw, (min-width: 768px) 33vw, 100vw"
									/>
								</div>
							)}

							<h2>{item.title}</h2>
						</div>
					</Link>
				))}
			</div>
		</>
	);
}
