"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";

// types
import { PortfolioCategory, PortfolioCategorySlugs, PortfolioItem } from "@/types/portfolio.types";

// styles
import styles from "./PortfolioList.module.scss";
// import variables from "../../styles/variables.scss";

import IconIdentity from "@assets/icon-identity.svg";
import IconWeb from "@assets/icon-web.svg";
import IconPackage from "@assets/icon-package.svg";


interface PortfolioCategoriesProps {
    portfolioCategories: PortfolioCategory[];
    categoriesCounts?: Record<string, number>;
}

const categoriesIconsMap = {
    [PortfolioCategorySlugs.IDENTITY]: IconIdentity,
    [PortfolioCategorySlugs.PACKAGE]: IconPackage,
    [PortfolioCategorySlugs.WEB]: IconWeb,
} as const;

export default function PortfolioCategories({ portfolioCategories, categoriesCounts }: PortfolioCategoriesProps) {
    return (
        // <ul className={styles.categoriesList}>

<div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
            {portfolioCategories.map((category, index) => {
                const CategoryIcon = categoriesIconsMap[category.slug];
                // console.log(CategoryIcon);
                return (
                    <div className="col" key={category.slug}>
                        <h2>{category.name} <span className={styles.itemsCount}>{categoriesCounts && categoriesCounts[category.slug] || 0}</span></h2>
                        <div className={`${styles.portfolioImageWrp} ${styles[category.slug]} d-flex justify-content-center align-items-center`}>
                            <CategoryIcon className={styles.svgIcon} />
                            {/* <Image src={`/assets/icon-${category.slug}.svg`} width={100} height={100} alt={category.name} aria-hidden="true" /> */}
                        </div>
                        </div>
                )
            })}
                    </div>

    )
}

// type Props = {
//     category: PortfolioCategorySlugs;
// };

// export function CategoryIcon({ category }: Props) {
// const Icon = categoriesIconsMap[category];

// if (!Icon) return null; // fallback for unknown categories

// return <Icon aria-hidden="true" />;
// }