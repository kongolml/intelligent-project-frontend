import Image from "next/image";

// types
import { PortfolioCategory, PortfolioItem, PortfolioCategorySlugs } from "../../../types/portfolio.types";

import IconIdentity from "@assets/icon-identity.svg";
import IconWeb from "@assets/icon-web.svg";
import IconPackage from "@assets/icon-package.svg";

// import styles from "./ServicesList.module.scss";

interface ServicesListProps {
	portfolioCategories: PortfolioCategory[];
}

const servicesIconsMap = {
	[PortfolioCategorySlugs.IDENTITY]: IconIdentity,
	[PortfolioCategorySlugs.PACKAGE]: IconPackage,
	[PortfolioCategorySlugs.WEB]: IconWeb,
};

export default async function ServicesList({ portfolioCategories }: ServicesListProps) {
	return (
		<section className="what-we-do d-flex align-items-center" id="our-services" style={{ height: 'calc(100vh - 100px - 24px)' }}>
			<div className="container">
				<div className="row">
					<div className="col-12 col-sm-10 offset-sm-1">
						<div className="services-content-wrp">
							<h2 className="text-center">Services</h2>
							<div className="row row-cols-1 row-cols-lg-5 justify-content-center">
								{portfolioCategories.map((category) => {
									const CategoryIcon = servicesIconsMap[category.slug];

									return (
										<div className="col" key={category.id}>
											<div className="text-center d-flex flex-column vertical category-title">
												{CategoryIcon && (
													<CategoryIcon
														className={`category-icon icon-${category.slug}`}
														style={{
															height: "8rem",
														}}
													/>
												)}
												{category.name}
											</div>
										</div>
									);
								})}
							</div>

							<div className="row">
								<div className="col-12 col-sm-8 offset-sm-2">
									<div className="cat-content-wrp">
										<i className="icon-close close-cat-content"></i>

										{portfolioCategories.map(category => (
											<div className="category-content" key={category.slug}>
												<div className="content fadeInDown">{category.description}</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
