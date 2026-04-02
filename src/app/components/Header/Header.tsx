"use client";

import { useCallback, useEffect, useRef, useState, CSSProperties } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@assets/intelligent-project-logo.svg";
import { useFilterBar } from "@/app/contexts/FilterBarContext";
import styles from "./Header.module.scss";

const NAV_ITEMS = [
	{ href: "/projects", label: "Projects", index: "01" },
	{ href: "/about-us", label: "About us", index: "02" },
	{ href: "/contact", label: "Contact", index: "03" },
];

// ─── Spring Physics ───
const STIFFNESS = 180;
const DAMPING = 14;
const MASS = 1;
const REST_THRESHOLD = 0.001;

interface Spring {
	value: number;
	velocity: number;
	target: number;
}

function stepSpring(s: Spring, dt: number) {
	const force = -STIFFNESS * (s.value - s.target);
	const damping = -DAMPING * s.velocity;
	const accel = (force + damping) / MASS;
	s.velocity += accel * dt;
	s.value += s.velocity * dt;
}

function springAtRest(s: Spring) {
	return (
		Math.abs(s.value - s.target) < REST_THRESHOLD &&
		Math.abs(s.velocity) < REST_THRESHOLD
	);
}

export default function Header() {
	const pathname = usePathname();
	const [entered, setEntered] = useState(false);
	const [introPlayed, setIntroPlayed] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [showPills, setShowPills] = useState(false);
	const headerRef = useRef<HTMLElement>(null);
	const { filterBarDocked, categories, categoryCounts, selectedCategory: activeCategory, onCategoryChange } = useFilterBar();
	const filterBarDockedRef = useRef(false);

	const activeIndex = NAV_ITEMS.findIndex(
		(item) => pathname === item.href || pathname.startsWith(item.href + "/")
	);

	const isProjectsPage = pathname === "/projects" || pathname.startsWith("/projects/");

	// Spring-driven morph
	const springRef = useRef<Spring>({ value: 0, velocity: 0, target: 0 });
	const rafRef = useRef(0);
	const scrolledRef = useRef(false);

	const computeLayout = useCallback(() => {
		const vw = window.innerWidth;
		// Expanded: match page content margins, centered
		const pageMargin = Math.min(80, Math.max(24, vw * 0.05));
		const expanded = Math.min(1200, vw - pageMargin * 2);
		const expandedLeft = (vw - expanded) / 2;
		// Compact: tighter pill, tucked to the left — wider when categories are docked
		const hasCats = filterBarDockedRef.current && isProjectsPage;
		const compact = hasCats ? Math.min(760, vw * 0.9) : Math.min(460, vw * 0.7);
		const compactLeft = pageMargin;
		return { expanded, compact, expandedLeft, compactLeft };
	}, [isProjectsPage]);

	const applySpring = useCallback(() => {
		const el = headerRef.current;
		if (!el) return;

		const m = springRef.current.value;
		const clampedM = Math.max(-0.05, Math.min(1.05, m)); // allow slight overshoot visually
		const clamped01 = Math.max(0, Math.min(1, m));
		const { expanded, compact, expandedLeft, compactLeft } = computeLayout();

		// Interpolate
		const width = expanded + (compact - expanded) * clampedM;
		const left = expandedLeft + (compactLeft - expandedLeft) * clampedM;
		const radius = 12 + (40 - 12) * clampedM;

		// Background: dark transparent → cream glass
		// Expanded (m=0): subtle dark overlay like Apple nav
		// Compact (m=1): warm cream glass pill
		const darkR = 18, darkG = 18, darkB = 18;
		const creamR = 245, creamG = 242, creamB = 237;
		const bgR = Math.round(darkR + (creamR - darkR) * clamped01);
		const bgG = Math.round(darkG + (creamG - darkG) * clamped01);
		const bgB = Math.round(darkB + (creamB - darkB) * clamped01);
		const bgAlpha = 0.12 + (0.42 - 0.12) * clamped01;

		const blur = 14 + (32 - 14) * clamped01;
		const saturate = 180 - (180 - 120) * clamped01; // 180% expanded → 120% compact
		const shadow = 0.02 + (0.1 - 0.02) * clamped01;
		const borderAlpha = 0.06 + (0.14 - 0.06) * clamped01;
		// Gentle drift: max 6px
		const scrollY = window.scrollY;
		const drift = Math.min(scrollY / 300, 1) * 6;

		el.style.width = `${width}px`;
		el.style.left = `${left}px`;
		el.style.borderRadius = `${radius}px`;
		el.style.background = `rgba(${bgR}, ${bgG}, ${bgB}, ${bgAlpha})`;
		el.style.backdropFilter = `saturate(${Math.round(saturate)}%) blur(${blur}px)`;
		el.style.setProperty("-webkit-backdrop-filter", `saturate(${Math.round(saturate)}%) blur(${blur}px)`);
		el.style.boxShadow = `0 4px 30px rgba(10, 10, 10, ${shadow})`;
		el.style.borderColor = `rgba(255, 255, 255, ${borderAlpha})`;
		el.style.transform = `translateY(${drift}px)`;
	}, [computeLayout]);

	const tick = useCallback(() => {
		const s = springRef.current;
		// Sub-step for stability
		const steps = 4;
		const dt = 1 / (60 * steps);
		for (let i = 0; i < steps; i++) {
			stepSpring(s, dt);
		}

		applySpring();

		if (!springAtRest(s)) {
			rafRef.current = requestAnimationFrame(tick);
		} else {
			// Snap to target
			s.value = s.target;
			s.velocity = 0;
			applySpring();
		}
	}, [applySpring]);

	const startSpring = useCallback(() => {
		cancelAnimationFrame(rafRef.current);
		rafRef.current = requestAnimationFrame(tick);
	}, [tick]);

	// Scroll detection → drive spring target
	const handleScroll = useCallback(() => {
		const y = window.scrollY;
		const shouldCompact = y > 20;

		if (shouldCompact !== scrolledRef.current) {
			scrolledRef.current = shouldCompact;
			setScrolled(shouldCompact);
			springRef.current.target = shouldCompact ? 1 : 0;
			startSpring();
		} else {
			// Still update drift
			applySpring();
		}
	}, [startSpring, applySpring]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		// Recompute widths on resize
		const handleResize = () => applySpring();
		window.addEventListener("resize", handleResize, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
			cancelAnimationFrame(rafRef.current);
		};
	}, [handleScroll, applySpring]);

	// Apply initial state immediately
	useEffect(() => {
		applySpring();
	}, [applySpring]);

	// Reset pills when leaving /projects
	useEffect(() => {
		if (!isProjectsPage) {
			setShowPills(false);
			filterBarDockedRef.current = false;
		}
	}, [isProjectsPage]);

	// React to filter bar docking — widen header + show category pills
	useEffect(() => {
		if (!isProjectsPage) return;
		if (filterBarDocked === filterBarDockedRef.current) return;

		filterBarDockedRef.current = filterBarDocked;

		if (filterBarDocked && scrolledRef.current) {
			// Nudge spring for elastic bounce as header widens
			springRef.current.target = 0.96;
			startSpring();
			requestAnimationFrame(() => {
				springRef.current.target = 1;
				startSpring();
			});
			// Delay pill reveal so header starts widening first
			const timer = setTimeout(() => setShowPills(true), 100);
			return () => clearTimeout(timer);
		} else {
			setShowPills(false);
			// Nudge spring for elastic shrink
			if (scrolledRef.current) {
				springRef.current.target = 1.04;
				startSpring();
				requestAnimationFrame(() => {
					springRef.current.target = 1;
					startSpring();
				});
			}
		}
	}, [filterBarDocked, isProjectsPage, startSpring]);

	// Entrance animation — once per session
	useEffect(() => {
		const hasPlayed = sessionStorage.getItem("header-intro");
		if (hasPlayed) {
			setEntered(true);
			setIntroPlayed(true);
			return;
		}

		requestAnimationFrame(() => {
			setEntered(true);
		});

		const timer = setTimeout(() => {
			setIntroPlayed(true);
			sessionStorage.setItem("header-intro", "1");
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<header
			ref={headerRef}
			className={`
				${styles.header}
				${scrolled ? styles.headerScrolled : ""}
				${entered ? styles.headerEntered : ""}
				${introPlayed ? styles.headerSettled : ""}
			`}
		>
			<div className={styles.headerInner}>
				{/* Logo */}
				<Link href="/" className={styles.logoLink} aria-label="Home">
					<Logo width={32} height={32} fill="currentColor" />
				</Link>

				{/* Navigation */}
				<nav aria-label="Main navigation">
					<ul className={styles.navList}>
						{NAV_ITEMS.map((item, i) => {
							const isActive = i === activeIndex;
							return (
								<li
									key={item.href}
									className={styles.navItem}
									style={{ "--stagger": `${i * 80 + 300}ms` } as CSSProperties}
								>
									<Link
										href={item.href}
										className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
									>
										<span className={styles.navIndex} aria-hidden="true">
											{item.index}
										</span>
										<span className={styles.navText}>
											{item.label}
										</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* Category pills — appear when filter bar docks into header */}
				{isProjectsPage && categories.length > 0 && (
					<div
						className={`${styles.categorySection} ${showPills ? styles.categorySectionVisible : ""}`}
					>
						<span className={styles.categoryDivider} />
						<button
							className={`${styles.categoryPill} ${
								showPills ? styles.categoryPillEnter : ""
							} ${activeCategory === "all" ? styles.categoryPillActive : ""}`}
							style={{ "--cat-stagger": "0ms" } as CSSProperties}
							onClick={() => onCategoryChange("all")}
						>
							All
						</button>
						{categories.map((cat, i) => (
							<button
								key={cat.slug}
								className={`${styles.categoryPill} ${
									showPills ? styles.categoryPillEnter : ""
								} ${activeCategory === cat.slug ? styles.categoryPillActive : ""}`}
								style={{ "--cat-stagger": `${(i + 1) * 50}ms` } as CSSProperties}
								onClick={() => onCategoryChange(cat.slug)}
							>
								{cat.name}
								<span className={styles.categoryPillCount}>
									{categoryCounts[cat.slug] || 0}
								</span>
							</button>
						))}
					</div>
				)}
			</div>
		</header>
	);
}
