"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

// types
import { PortfolioCategory, PortfolioCategorySlugs, PortfolioItem } from "@/types/portfolio.types";

// styles
import styles from "./PortfolioList.module.scss";
// import PortfolioCategories from "./PortfolioCategories";
import PortfolioCategories from "@/app/components/PortfolioList/PortfolioCategories";
import IconIdentity from "@assets/icon-identity.svg";
import IconWeb from "@assets/icon-web.svg";
import IconPackage from "@assets/icon-package.svg";

interface PortfolioListProps {
	portfolioItems: PortfolioItem[];
	portfolioCategories: PortfolioCategory[];
}

const categoriesIconsMap = {
	[PortfolioCategorySlugs.IDENTITY]: IconIdentity,
	[PortfolioCategorySlugs.PACKAGE]: IconPackage,
	[PortfolioCategorySlugs.WEB]: IconWeb,
} as const;

// Custom Hook to measure an element's width
const useElementWidth = () => {
	const ref = useRef(null);
	const [width, setWidth] = useState(0);
  
	const updateWidth = useCallback(() => {
	  if (ref.current) {
		setWidth(ref.current.offsetWidth);
	  }
	}, []);
  
	useEffect(() => {
	  updateWidth(); // Set initial width
  
	  const element = ref.current;
	  if (!element) return;
  
	  // Use ResizeObserver to update width when the element resizes
	  const observer = new ResizeObserver(() => {
		updateWidth();
	  });
  
	  observer.observe(element);
  
	  // Cleanup function to disconnect the observer
	  return () => {
		observer.disconnect();
	  };
	}, [updateWidth]);
  
	return { ref, width };
  };

export default function PortfolioList({ portfolioItems, portfolioCategories }: PortfolioListProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const { ref: sourceRef, width: sourceWidth } = useElementWidth();

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

	const targetRef = useRef<HTMLDivElement>(null);
	const scrollToCategory = (category: string) => {
		// const categoryElement = document.getElementById(category);
		// if (categoryElement) {
		// 	categoryElement.scrollIntoView({ behavior: "smooth" });
		// }
		handleCategoryChange(category);
		targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<>
			<div className="container">
				{/* <div className="row"> */}
				{/* <PortfolioCategories portfolioCategories={portfolioCategories}  /> */}
				{/* </div> */}

				<div className="d-flex justify-content-center flex-column vh-100 ">
					<div className="row"><h1>Projects</h1></div>

					<div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 w-100">
						{portfolioCategories.map((category, index) => {
							const CategoryIcon = categoriesIconsMap[category.slug];

							return (
								<div className="col" key={category.slug} onClick={() => scrollToCategory(category.slug)}>
									<h2>
										{category.name} <span className={styles.itemsCount}>{(categoryCounts && categoryCounts[category.slug]) || 0}</span>
									</h2>
									<div className={`${styles.portfolioImageWrp} ${styles[category.slug]} d-flex justify-content-center align-items-center`}>
										<CategoryIcon className={styles.svgIcon} />
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* <div className={styles.flexContainer} >
					{portfolioCategories.map((category, index) => {
						const CategoryIcon = categoriesIconsMap[category.slug];

						return (
							<div  key={category.slug} onClick={() => scrollToCategory(category.slug)} className={styles.flexItem} style={{ width: sourceWidth }}>
								<h2>
									{category.name} <span className={styles.itemsCount}>{(categoryCounts && categoryCounts[category.slug]) || 0}</span>
								</h2>
								<div className={`${styles.portfolioImageWrp} ${styles[category.slug]} d-flex justify-content-center align-items-center`}>
									<CategoryIcon className={styles.svgIcon} />
								</div>
							</div>
						);
					})}
				</div> */}
			</div>

			{/* <div className={styles.projectsGrid}> */}

				<div className="container" ref={targetRef}>
					<div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
						{filteredItems.map((item) => (
							<div className="col" key={item.id}>
								<Link href={`/projects/${item.slug}`}>
									<div className={styles.projectCard}>
										{item.thumbnail && (
											<div className={styles.imageWrap}>
												<Image
													src={item.thumbnail}
													alt={item.title}
													fill
													className={styles.projectImg}
													sizes="(min-width: 1200px) 33vw, (min-width: 768px) 33vw, 100vw"
													draggable={false}
													onContextMenu={(e) => e.preventDefault()}
												/>
											</div>
										)}

										<p>{item.title}</p>
									</div>
								</Link>
							</div>
						))}
					</div>
				</div>

		</>
	);
}
