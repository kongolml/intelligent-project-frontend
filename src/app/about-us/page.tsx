import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// types
import { Teammate } from '../../types/teammate.types';

export default async function AboutUsPage() {
    const teammates = await fetch('http://localhost:3000/public-api/teammates');
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
                                <p>{teammate.name}</p>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </main>
    );
}