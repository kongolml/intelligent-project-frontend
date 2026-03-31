import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "next/image";

// lib
import { getTeammates } from "../lib/api";

// types
import { Teammate } from "../../types/teammate.types";

import styles from "./Teammate.module.scss";


export default async function AboutUsPage() {
	let teammatesData: Teammate[] = [];

	try {
		teammatesData = await getTeammates();
	} catch {
		// API unavailable — render with empty team
	}

	return (
		<main>
			<section style={{ paddingTop: 100 }}>
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
