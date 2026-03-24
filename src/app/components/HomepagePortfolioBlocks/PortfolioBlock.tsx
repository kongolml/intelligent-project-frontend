import Image from "next/image";
import Link from "next/link";

// types
import { PortfolioItem, PortfolioCategorySlugs } from "@/types/portfolio.types";

// styles
import styles from "./PortfolioBlock.module.scss";

import IconIdentity from "@assets/user-focus.svg";
import IconWeb from "@assets/globe-simple.svg";
import IconPackage from "@assets/package.svg";

interface PortfolioBlockProps {
	portfolioItem: PortfolioItem;
	index: number;
	size?: "small"
}

const categoriesColorMapping = {
	[PortfolioCategorySlugs.IDENTITY]: styles.categoryIconIdentity,
	[PortfolioCategorySlugs.WEB]: styles.categoryIconWeb,
	[PortfolioCategorySlugs.PACKAGE]: styles.categoryIconPackage
}

const servicesIconsMap = {
	[PortfolioCategorySlugs.IDENTITY]: IconIdentity,
	[PortfolioCategorySlugs.PACKAGE]: IconPackage,
	[PortfolioCategorySlugs.WEB]: IconWeb
}

export default function PortfolioBlock({ portfolioItem, index, size }: PortfolioBlockProps) {
	const imageUrl = portfolioItem.main_image;

	return (
		<div className={`${styles.portfolioBlock} ${styles[`index${index + 1}`]}`} style={{
			backgroundImage: `url(${imageUrl})`
		}}>
			{/* <Link href={`/portfolio/${portfolioItem.slug}`}> */}
			{size !== "small" && <p>{portfolioItem.title}</p>}

			{/* <p>{portfolioItem.description}</p> */}

			{/* <div className={styles.imageWrp}>
				<Image src={portfolioItem.main_image || 'https://mir-s3-cdn-cf.behance.net/project_modules/2800_webp/cb49d9229631565.6867efff8a713.png'} alt={portfolioItem.title} fill style={{ objectFit: "contain" }} className={styles.portfolioBlockImage} />
			</div> */}

			<div className={styles.categoriesList}>
				{portfolioItem.categories.map((category, index) => {
					const CategoryIcon = servicesIconsMap[category.slug];

					return (
						// <span key={index} className={styles.categoryPill}>
						// 	{category.name}
						// </span>
						<CategoryIcon key={category.slug} className={`${styles.categoryIcon} ${styles[`categoryIcon--${category.slug}`]}`} />
					)
				}
					)}
			</div>
			{/* </Link> */}
		</div>
	);
}
