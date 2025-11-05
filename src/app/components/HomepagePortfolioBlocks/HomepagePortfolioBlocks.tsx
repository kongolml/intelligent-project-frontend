"use client";


// types
import { PortfolioItem } from "@/types/portfolio.types";
import styles from "./PortfolioBlock.module.scss";

// components
import PortfolioBlock from "./PortfolioBlock";

interface HomepagePortfolioBlocksProps {
	portfolioItems: PortfolioItem[];
}

const colorPalette = {
	primary: "#3498db",
	secondary: "#2ecc71",
	accent: "#e74c3c",
};

function shuffle(array: any[]) {
	const arr = [...array]; // copy to avoid mutation
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

const colors = Object.values(colorPalette);
const shuffledColors = shuffle(colors);

const gridSizesMap = {
	"small": [4, 5, 6, 7]
}

function getSizeCategory(blockNumber: number): "small" | undefined {
  for (const [label, values] of Object.entries(gridSizesMap)) {
	// @ts-ignore
    if (values.includes(blockNumber)) return label;
  }

  return;
}

export default function HomepagePortfolioBlocks({ portfolioItems }: HomepagePortfolioBlocksProps) {
	// console.log("HomepagePortfolioBlocks", portfolioItems);
	return (
		<div className={styles.portfolioGrid}>
			{portfolioItems.map((item, index) => (
				<PortfolioBlock key={item.id} size={getSizeCategory(index + 1)} portfolioItem={item} index={index} />
			))}
		</div>
	);
}
