import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "next/image";

// lib
import { getApiUrl } from "../lib/api";

// types
import { Teammate } from "../../types/teammate.types";

import styles from "./Teammate.module.scss";

export default async function AboutUsPage() {
	const teammates = await fetch(`${getApiUrl()}/public-api/teammates`);
	const teammatesData: Teammate[] = await teammates.json();

	return (
		<main>
			<section>
				<Container>
					<Row>
						<Col>
							<h1>About Us</h1>
						</Col>
					</Row>

					<Row>
						{teammatesData.map((teammate) => (
							<Col lg={4} key={teammate.id}>
								<p>{teammate.title}</p>
								<div className={styles.rectangle}>
									{teammate.image.map((image, index) => (
                                        <>
                                            <div style={{ backgroundImage: `url(${image})` }} className={`${styles.avatar} ${styles.avatar}${index + 1}`}></div>
                                        </>
									))}
								</div>
								<p>{teammate.name}</p>
							</Col>
						))}
					</Row>
				</Container>
			</section>
		</main>
	);
}
