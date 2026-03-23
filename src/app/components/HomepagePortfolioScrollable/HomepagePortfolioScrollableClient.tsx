"use client";

import { useRef, useEffect, useState } from "react";
import { PortfolioItem } from "../../../types/portfolio.types";
import styles from "./HomepagePortfolioScrollable.module.scss";
import {useScrollEffects} from "@/app/hooks/useScrollEffects";

interface Props {
	showcasePortfolioItems: PortfolioItem[];
}

export default function HomepagePortfolioScrollableClient({ showcasePortfolioItems }: Props) {
	const heroRef = useRef<HTMLElement>(null);
	const projectsListRef = useRef<HTMLDivElement>(null);
	const projectNavRef = useRef<HTMLDivElement>(null);
	const projectsDemoRef = useRef<HTMLElement>(null);
	const ourServicesRef = useRef<HTMLElement | null>(null);

	const circleRef = useRef<HTMLDivElement>(null);

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		// Get reference to the #our-services element from ServicesList component
		const servicesElement = document.getElementById("our-services");
		if (servicesElement) {
			ourServicesRef.current = servicesElement;
		}
	}, []);

	useScrollEffects({
		isMobile,
		projectsCount: showcasePortfolioItems.length,
		projectsListRef,
		projectNavRef,
		projectsDemoRef,
		heroRef,
		ourServicesRef,
		circleRef
	});

	// useCircleEffect();

	return (
		<>
			<section className="hero d-flex align-items-center" style={{ height: '90vh' }} ref={heroRef}>
				<div className="container">
					<div className="row">
						<div className="col-12 col-sm-8 offset-md-1">
							<div id={styles.heroIntoText}>
								<h1 className={`${styles.weAre} we-are`}>|</h1>
								<div id="typewriter">
									{/* Брендинг, дизайн пакування та веб-розробка. */}
									{/* Чистий дизайн. Сильні бренди. Деталі мають значення. */}
									<span className="Typewriter__wrapper">Чистий дизайн. Сильні бренди. Деталі мають значення.</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* <div className={`${styles.circle} circle`} ref={circleRef}></div> */}
			</section>

			<section className={styles.whatWeDo} id="projects-demo" ref={projectsDemoRef}>
				<div className="container">
					<div className="row">
						<div className="col-12 col-xl-10 offset-xl-1">
							<div className={styles.projectsWrp}>
								<div className="row">
									<div className="col-12 col-md-4 col-xxl-3">
										<div className={styles.projectsNav} ref={projectNavRef}>
											<h2>Projects</h2>

											<ul className="slide-controls d-none d-md-block">
												{showcasePortfolioItems.map((item, index) => (
													<li 
														key={item.id} 
														className={`${styles.projectLink} category-${item.categories[0]?.slug || ''} ${index === 0 ? 'active' : ''}`}
													>
														<a 
															href={`#project-${item.id}`} 
															className="project-anchor" 
															data-project-number={index + 1}
														>
															{item.title}
														</a>
													</li>
												))}
												<li className={styles.linkToAll}>
													<a href="/projects" className={styles.realLink}>Дивитись всі</a>
												</li>
											</ul>
										</div>
									</div>
									<div className="col-12 col-md-8 col-xxl-9">
										<div className={styles.projectsListWrp} ref={projectsListRef}>
											<div className={styles.projectsList}>
												{showcasePortfolioItems.map((item, index) => (
													<figure 
														key={item.id} 
														id={`project-${index + 1}`}
														style={{ backgroundImage: `url(${item.main_image})` }} 
														className={`category-${item.categories[0]?.slug || ''}`}
													></figure>
												))}
											</div>
										</div>
									</div>
								</div>
								<div className={styles.scrollToServices}>↓</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

