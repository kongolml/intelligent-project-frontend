// types
import { PortfolioCategory, PortfolioItem } from "../../types/portfolio.types";

interface ServicesListProps {
    portfolioCategories: PortfolioCategory[];
}

export default async function ServicesList({portfolioCategories}: ServicesListProps) {
	return (
		<section className="what-we-do" id="our-services">
			<div className="container">
				<div className="row">
					<div className="col-12 col-sm-10 offset-sm-1">
						<div className="services-content-wrp">
							<h2 className="on-center">Services</h2>
							<div className="row row-cols-1 row-cols-lg-5 justify-content-center">
								{portfolioCategories.map((category) => {
									return (
										<div className="col" key={category.id}>
											<div className="on-center flex vertical category-title" data-category="cat-<?php echo $cat->cat_ID; ?>">
												<i className="icon-<?php the_field('iconmoon_className', 'category_' . $cat->cat_ID); ?>"></i>
												{category.name}
											</div>

											<div
												className="category-mobile-description d-block d-lg-none"
												dangerouslySetInnerHTML={{ __html: category.description || "" }}
											></div>
										</div>
									);
								})}
							</div>

							<div className="row">
								<div className="col-12 col-sm-8 offset-sm-2">
									<div className="cat-content-wrp">
										<i className="icon-close close-cat-content"></i>

										{/* <?php foreach ($portfolio_categories as $cat) { ?> */}
										<div className="category-content" data-category="cat-<?php echo $cat->cat_ID ?>">
											<div className="content fadeInDown">{/* <?php echo category_description($cat->cat_ID); ?> */}</div>
										</div>
										{/* <?php } ?> */}
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
