import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://evidenca-back-end.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (data.error) {
        setError(data.message || 'Login failed. Please check your credentials.');
        return;
      }

      // Store JWT token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));

      window.location.reload();
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    }
  };



  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f7f9fc' }}>
      <Row className="w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <img src="https://media.discordapp.net/attachments/714802276803543122/1298719826352541818/image.png?ex=6729bfd7&is=67286e57&hm=fe3d44cc51ec606217154247c110727e9457288bd5bee6fe0b17ccf626227c2c&=&format=webp&quality=lossless&width=526&height=109" alt="logo" className="mb-3" />
              <h6 className="text-muted mb-3">Login</h6>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="d-flex justify-content-between align-items-center mt-3">
                  <Form.Check type="checkbox" label="Remember me" />
                  <a href="#" className="text-primary">Forgot Password?</a>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-4">
                  LOGIN
                </Button>
              </Form>

              <p className="mt-4 mb-0">
                Don't have an account? <a href="/register" className="text-primary">Register Here</a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
