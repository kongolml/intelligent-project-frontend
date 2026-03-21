"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@assets/intelligent-project-logo.svg";
import styles from "./Header.module.scss";

const NAV_ITEMS = [
	{ href: "/projects", label: "Projects", index: "01" },
	{ href: "/about-us", label: "About us", index: "02" },
	{ href: "/contact", label: "Contact", index: "03" },
];

export default function Header() {
	const pathname = usePathname();
	const [scrolled, setScrolled] = useState(false);
	const [entered, setEntered] = useState(false);
	const [introPlayed, setIntroPlayed] = useState(false);
	const headerRef = useRef<HTMLElement>(null);

	const activeIndex = NAV_ITEMS.findIndex(
		(item) => pathname === item.href || pathname.startsWith(item.href + "/")
	);

	// Scroll detection for frosted glass transformation
	const handleScroll = useCallback(() => {
		setScrolled(window.scrollY > 20);
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	// Entrance animation — once per session
	useEffect(() => {
		const hasPlayed = sessionStorage.getItem("header-intro");
		if (hasPlayed) {
			setEntered(true);
			setIntroPlayed(true);
			return;
		}

		// Trigger entrance sequence
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
			{/* Accent line — grows on entrance */}
			<div className={styles.accentLine} aria-hidden="true" />

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
									style={{ "--stagger": `${i * 80 + 300}ms` } as React.CSSProperties}
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
			</div>
		</header>
	);
}
