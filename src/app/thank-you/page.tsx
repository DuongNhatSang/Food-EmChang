import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

export default function ThankYou() {
    return (
        <Container fluid style={{ backgroundImage: `url("/images/6_2_n.png")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', padding: '2rem', minHeight: '100vh' }}>
            <Row className="justify-content-center align-items-start" style={{ minHeight: '100vh', paddingTop: '4rem' }}>
                <Col md={{ span: 12 }} className="text-center">
                    <Alert variant="success">
                        <h1>Food-EmChang xin cảm ơn!</h1>
                        <p>Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
  }