"use client";

import { useRef } from "react";
// import useScrollEffects from "@/app/hooks/useScrollEffects";
import {useScrollEffects} from "@/app/hooks/useScrollEffects.gemini";
import { sanitizeHtml } from "../../lib/sanitize";
import styles from "./HomepagePortfolio.module.scss";
import { PortfolioItem as PortfolioItemType } from "../../../types/portfolio.types";


// components
import TypewriterBlock from "@/app/components/TypeWrighterBlock";

interface Props {
  randomPortfolioItems: PortfolioItemType[];
}

export default function HomepagePortfolioClient({ randomPortfolioItems }: Props) {
  // const heroRef = useRef<HTMLElement>(null);
  // const projectsListRef = useRef<HTMLElement>(null);
  const projectNavRef = useRef<HTMLUListElement>(null);
  // const projectsDemoRef = useRef<HTMLElement>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const projectsCount = randomPortfolioItems.length;

  // useScrollEffects({
  //   isMobile,
  //   projectsCount,
  //   projectsListRef,
  //   projectNavRef,
  //   projectsDemoRef,
  //   heroRef,
  // });

  // We specify the element type for better type safety.
            const heroRef = useRef<HTMLElement>(null);
            const heroTextRef = useRef<HTMLDivElement>(null);
            const projectsDemoRef = useRef<HTMLElement>(null);
            const projectsWrapperRef = useRef<HTMLDivElement>(null);
            const projectsListRef = useRef<HTMLDivElement>(null);
            const slideControlsRef = useRef<HTMLUListElement>(null);
            const scrollToServicesRef = useRef<HTMLDivElement>(null);

            // Use the custom hook and pass the refs and data
            const { scrollToProject, scrollToServices } = useScrollEffects({
                heroRef,
                heroTextRef,
                projectsDemoRef,
                projectsWrapperRef,
                projectsListRef,
                // slideControlsRef,
                scrollToServicesRef,
                projectsCount: 3,
            });

      return (
        <>
        <section className="hero flex" ref={heroRef}>
				<div className="container">
					<div className="row">
						<div className="col-12 col-sm-8 offset-md-1">
							<div id="hero-into-text" ref={heroTextRef}>
								<h1>Intelligent Project</h1>
								<TypewriterBlock />
							</div>
						</div>
					</div>
				</div>
			</section>
        <section className={styles["what-we-do"]} id="projects-demo" ref={projectsDemoRef}>
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
                                    <ul className={`${styles["projects-nav"]} d-none d-md-block`} ref={projectNavRef}>
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
                                <div className="projects-list-wrp" ref={projectsWrapperRef}>
                                    <div className="projects-list" ref={projectsListRef}>
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
                                                    style={{ backgroundImage: `url('${portfolioItem.main_image}')` }}
                                                    key={portfolioItem.id}
                                                >
                                                    <figcaption>
                                                        <div className={styles["description-wrp"]} dangerouslySetInnerHTML={{ __html: sanitizeHtml(portfolioItem.descriptionHTML || "") }}>
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

                        <div className="scroll-to-services" ref={scrollToServicesRef}>
                            <i className="icon-chevron-down"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
    )

}
