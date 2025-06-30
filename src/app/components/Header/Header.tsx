// styles
import styles from "./Header.module.scss";

export default function Header() {
	return (
		<header>
			<div className={styles["mobile-header-wrp"]}>
				<a href="/" className={styles["logo-link"]}>
					<i className="icon-intelligent-project-logo"></i>
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
