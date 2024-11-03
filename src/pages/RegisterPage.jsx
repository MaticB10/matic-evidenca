import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Preveri, ali so vsa polja izpolnjena
    if (!fullName || !phoneNumber || !postalAddress || !email || !password || !acceptedTerms) {
      setError('Please fill in all fields and accept the terms.');
      return;
    }

    try {
      const response = await fetch('https://evidenca-back-end.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          postalAddress,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Registration failed. Please try again.');
        return;
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000); // Preusmeri na prijavno stran po 2 sekundah
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error('Error during registration:', err);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f7f9fc' }}>
      <Row className="w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <img src="https://via.placeholder.com/60" alt="logo" className="mb-3" />
              <h5 className="mb-4">CROWN</h5>
              <h6 className="text-muted mb-3">REGISTER</h6>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleRegister}>
                <Form.Group controlId="formFullName" className="text-start">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formPhoneNumber" className="mt-3 text-start">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formPostalAddress" className="mt-3 text-start">
                  <Form.Label>Postal Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter postal address"
                    value={postalAddress}
                    onChange={(e) => setPostalAddress(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-3 text-start">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3 text-start">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formTerms" className="d-flex justify-content-start align-items-center mt-3 text-start">
                  <Form.Check
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <Form.Label className="ms-2">
                    I accept <a href="#" className="text-primary">Terms & Conditions</a>
                  </Form.Label>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-4">
                  REGISTER
                </Button>
              </Form>

              <p className="mt-4 mb-0">
                Already have an account? <a href="/" className="text-primary">Login Here</a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
