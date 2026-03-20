"use client";

// styles
import styles from "./Header.module.scss";
import Link from "next/link";

import Logo from "@assets/intelligent-project-logo.svg";


export default function Header() {
	return (
		<header>
			<div className={styles["mobile-header-wrp"]}>
				<Link href="/" className={styles["logo-link"]}>
					<Logo width={40} height={40} fill="currentColor" />
				</Link>

				<div className={styles["menu-trigger"]}></div>
			</div>

			<nav>
				<ul>
					<li><Link href="/projects">Projects</Link></li>
					<li><Link href="/about-us">About us</Link></li>
					<li><Link href="/contact">Contact</Link></li>
				</ul>
			</nav>

			{/* <?php language_selector(); ?> */}
		</header>
	);
}
