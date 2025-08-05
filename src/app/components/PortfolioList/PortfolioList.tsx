"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// types
import { PortfolioCategory, PortfolioItem } from "@/types/portfolio.types";

// styles
import styles from "./PortfolioList.module.scss";

interface PortfolioListProps {
	portfolioItems: PortfolioItem[];
	portfolioCategories: PortfolioCategory[];
}

export default function PortfolioList({ portfolioItems, portfolioCategories }: PortfolioListProps) {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	const filteredItems = useMemo(() => {
		return selectedCategory === "all"
			? portfolioItems
			: portfolioItems.filter((item) => item.categories.some((category) => category.slug === selectedCategory));
	}, [portfolioItems, selectedCategory]);

	return (
		<>
			<ul className={styles.categoriesList}>
				<li
					onClick={() => setSelectedCategory("all")}
					className={selectedCategory === "all" ? styles.active : ""}
				>
					All
				</li>
				{portfolioCategories.map((category) => (
					<li
						key={category.slug}
						onClick={() => setSelectedCategory(category.slug)}
						className={selectedCategory === category.slug ? styles.active : ""}
					>
						{category.name}
					</li>
				))}
			</ul>

			<ul>
				{filteredItems.map((item) => (
					<li key={item.id}>
						{item.thumbnail && <Image src={item.thumbnail} alt={item.title} width={150} height={100} />}
						<h2>{item.title}</h2>
						{item.description && <div dangerouslySetInnerHTML={{ __html: item.description }} />}
						<p>Category: {item.categories.map((cat) => cat.name).join(", ")}</p>
						{item.mediaFiles.length > 0 && <p>has mediaFiles!</p>}
						<Link href={`/projects/${item.id}`}>View Project</Link>
					</li>
				))}
			</ul>
		</>
	);
}
