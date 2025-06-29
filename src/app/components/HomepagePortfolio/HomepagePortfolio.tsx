// types
import { PortfolioCategory, PortfolioItem, PortfolioItem as PortfolioItemType } from "../../../types/portfolio.types";
// import PortfolioItem from "."; // Adjust the import path as necessary

// styles
import styles from "./HomepagePortfolio.module.scss";


export default async function HomepagePortfolio(s) {
    // const randomPortfolioItemsPromises = portfolioCategories.map(async (category) => {
    //     const result = await PortfolioItem.aggregate([
    //         {
    //         $match: {
    //             status: 'publish',
    //             'categories': category.name,
    //         },
    //         },
    //         { $sample: { size: 1 } },
    //     ]);

    //     return result[0] || null;
    // });

      const randomPortfolioItemsRequest= await fetch("http://localhost:3000/public-api/portfolio/random-demo", {
		// Recommended for SSR caching control:
		cache: "no-store", // or `next: { revalidate: 60 }` for ISR,
	});

    const randomPortfolioItems: PortfolioItemType[] = await randomPortfolioItemsRequest.json();

    return (
        <section className={styles["what-we-do"]} id="projects-demo">
        <div className="container">
            <div className="row">
                <div className="col-12 col-xl-10 offset-xl-1">
                    <div className={styles["projects-wrp"]}>
                        <div className="row">
                            <div className="col-12 col-md-4 col-xxl-3">
                                <div className={styles["projects-nav"]}>
                                    <h2>
                                        Projects

                                        <a href="<?php echo get_permalink(get_page_by_path('projects')); ?>" className="d-block d-md-none">
                                            {/* <?php echo _e('View all', 'intelligent-project-theme'); ?> */}
                                        </a>
                                    </h2>
                                    <ul className={`${styles["projects-nav"]} d-none d-md-block`}>
                                        {randomPortfolioItems.map((portfolioItem) => {
                                            return (
                                                <li
                                                    className={`${styles["project-link"]} category-${portfolioItem.id}`}
                                                    key={portfolioItem.id}
                                                >
                                                    <a
                                                        href={`#project-${portfolioItem.id}`}
                                                        className={styles["project-anchor"]}
                                                        data-project-number={portfolioItem.id}
                                                    >
                                                        {portfolioItem.title}
                                                    </a>
                                                </li>
                                            );
                                        })}

                                        {/* <li className="link-to-all"><a href="<?php echo get_permalink(get_page_by_path('projects')); ?>" className="real-link"><?php echo _e('View all', 'intelligent-project-theme'); ?></a></li> */}
                                    </ul>
                                </div>
                            </div>

                            <div className="col-12 col-md-8 col-xxl-9">
                                <div className="projects-list-wrp">
                                    <div className="projects-list">
                                        {/* <?php
                                        $featured_portfolio_items_shown = 0;
                                        $portfolio_image_size = wp_is_mobile() ? 'medium' : 'large';

                                        foreach ($random_portfolio_items as $category_id => $portfolio_item) {
                                            $featured_portfolio_items_shown++;
                                        ?> */}
                                        {randomPortfolioItems.map((portfolioItem, index) => {
                                            return (
                                                <figure
                                                    id={`project-${index + 1}`}
                                                    // style="background-image: url('<?php echo wp_get_attachment_image_src(get_post_thumbnail_id($portfolio_item->ID), $portfolio_image_size)[0]; ?>');"
                                                    className="category-shit"
                                                    key={portfolioItem.id}
                                                >
                                                    <figcaption>
                                                        <div className={styles["description-wrp"]} dangerouslySetInnerHTML={{ __html: portfolioItem.description || "" }}>
                                                        </div>
                                                    </figcaption>
                                                </figure>
                                            )
                                        })}
                                        {/* <?php
                                        }
                                        ?> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="scroll-to-services">
                            <i className="icon-chevron-down"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}