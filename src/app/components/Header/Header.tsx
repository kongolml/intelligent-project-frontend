// styles
import styles from "./Header.module.scss";

import Logo from "@assets/intelligent-project-logo.svg";


export default function Header() {
	return (
		<header>
			<div className={styles["mobile-header-wrp"]}>
				<a href="/" className={styles["logo-link"]}>
					<Logo width={40} height={40} fill="currentColor" />
				</a>

				<div className={styles["menu-trigger"]}></div>
			</div>

			<nav>
				<ul>
					<li><a href="/projects">Projects</a></li>
					<li><a href="/about-us">About us</a></li>
					<li><a href="/contact">Contact</a></li>
				</ul>
			</nav>

			{/* <?php language_selector(); ?> */}
		</header>
	);
}
