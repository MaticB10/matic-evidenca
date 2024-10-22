import React from 'react';
import { Form, Button, Col, Row, Container, Card, InputGroup } from 'react-bootstrap';


function RezervacijaTermina() {
  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h3>Form s</h3>
        </Col>
      </Row>

      <Row>
        {/* Dropdowns and Multiple Select */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Dropdown & Multiple Select</Card.Title>
              <Form.Group controlId="selectUser">
                <Form.Label>Select User</Form.Label>
                <Form.Control as="select">
                  <option>Select User</option>
                  <option>Glenne Headly</option>
                  <option>Hansom Deck</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="selectMultipleUsers" className="mt-3">
                <Form.Label>Select Multiple Users</Form.Label>
                <Form.Control as="select" multiple>
                  <option>Gunther Beard</option>
                  <option>Hansom Deck</option>
                  <option>Glenne Headly</option>
                </Form.Control>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* File Upload */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>File Upload Options</Card.Title>
              <Form.Group>
                <Form.File id="formcheck-api-regular" label="Upload Files - Button" />
              </Form.Group>
              <Button className="mt-3" variant="primary">Upload</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Drag and Drop Upload */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Drag & Drop Upload</Card.Title>
              <div className="drag-drop-upload d-flex justify-content-center align-items-center" style={{ border: '2px dashed #007bff', height: '150px', borderRadius: '10px' }}>
                <span>Select or Drop Files here</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Date & Time Picker */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Date & Time Picker</Card.Title>
              <Form.Group>
                <Form.Label>Pick a Date</Form.Label>
                <InputGroup>
                  <Form.Control type="date" />
                  <InputGroup.Append>
                    <InputGroup.Text><i className="bi bi-calendar"></i></InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Pick a Time</Form.Label>
                <InputGroup>
                  <Form.Control type="time" />
                  <InputGroup.Append>
                    <InputGroup.Text><i className="bi bi-clock"></i></InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Check Box and Radio Buttons */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Check Box and Radio Buttons</Card.Title>
              <Form.Check type="checkbox" label="Checked Checkbox" defaultChecked />
              <Form.Check type="checkbox" label="Unchecked Checkbox" className="mt-2" />
              <Form.Check type="radio" name="radioGroup" label="Selected Radio Button" defaultChecked className="mt-3" />
              <Form.Check type="radio" name="radioGroup" label="Unselected Radio Button" className="mt-2" />
            </Card.Body>
          </Card>
        </Col>

        {/* Toggle Buttons */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Switches & Toggle</Card.Title>
              <Form.Check type="switch" label="Primary Toggle Button" className="text-primary" />
              <Form.Check type="switch" label="Purple Toggle Button" className="text-purple" />
              <Form.Check type="switch" label="Yellow Toggle Button" className="text-warning" />
              <Form.Check type="switch" label="Green Toggle Button" className="text-success" />
              <Form.Check type="switch" label="Aqua Blue Toggle Button" className="text-info" />
              <Form.Check type="switch" label="Disabled Toggle Button" disabled />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RezervacijaTermina;
