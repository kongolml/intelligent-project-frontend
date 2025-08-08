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

	useEffect(() => {
        setSelectedCategory(initialCategory);
    }, [initialCategory]);

	const handleCategoryChange = (category: string) => {
		router.push(category === "all" ? "/projects" : `/projects/category/${category}`);
        setSelectedCategory(category);
    };

	return (
		<>
			<ul className={styles.categoriesList}>
				<li onClick={() => handleCategoryChange("all")} className={selectedCategory === "all" ? styles.active : ""}>
					All<sup>{allItemsLength}</sup>
				</li>
				{portfolioCategories.map((category) => (
					<li
						key={category.slug}
						onClick={() => handleCategoryChange(category.slug)}
						className={selectedCategory === category.slug ? styles.active : ""}
					>
						{category.name}
					</li>
				))}
			</ul>

			<div className={styles.projectsGrid}>
				{filteredItems.map((item) => (
					<div key={item.id} className={styles.projectCard}>
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
						{item.description && <div dangerouslySetInnerHTML={{ __html: item.description }} />}
						<p>Category: {item.categories.map((cat) => cat.name).join(", ")}</p>
						{item.mediaFiles.length > 0 && <p>has mediaFiles!</p>}
						<Link href={`/projects/${item.slug}`}>View Project</Link>
					</div>
				))}
			</div>
		</>
	);
}
