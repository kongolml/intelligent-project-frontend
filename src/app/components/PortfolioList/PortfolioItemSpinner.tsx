import styles from "./PortfolioItemSpinner.module.scss";

export default function PortfolioItemSpinner() {
	return (
		<div className={styles.overlay}>
			<svg className={styles.spinner} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle className={styles.track} cx="20" cy="20" r="16" strokeWidth="2" />
				<circle className={styles.arc} cx="20" cy="20" r="16" strokeWidth="2" />
			</svg>
		</div>
	);
}
