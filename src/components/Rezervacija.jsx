import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, ProgressBar, Badge, Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../styles/CustomTable.css'; // Dodaj povezavo do datoteke za stiliranje

function Rezervacija() {
  const [isAdmin, setIsAdmin] = useState(true); // Spremenite to glede na dejanskega uporabnika
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // Trenutno izbrani projekt
  const [chatMessage, setChatMessage] = useState(""); // Sledenje sporočilu
  const [projects, setProjects] = useState([]); // Shranjevanje projektov iz baze

  // Nove vrednosti za urejanje
  const [editedPriority, setEditedPriority] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [editedProgress, setEditedProgress] = useState('');

  // Pridobimo projekte iz API-ja
  useEffect(() => {
    axios.get('https://evidenca-back-end.onrender.com/projects')
      .then(response => {
        if (!response.data.error) {
          setProjects(response.data.data); // Nastavimo projekte iz baze
        }
      })
      .catch(error => {
        console.error('Napaka pri pridobivanju projektov:', error);
      });
  }, []);

  // Filtriramo zaključene in preklicane projekte
  const completedAndCanceledProjects = projects.filter(
    (project) => project.status === "Completed" || project.status === "Canceled"
  );

  // Filtriramo aktivne projekte
  const activeProjects = projects.filter(
    (project) => project.status !== "Completed" && project.status !== "Canceled"
  );

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setEditedPriority(project.priority);
    setEditedStatus(project.status);
    setEditedProgress(project.progress);
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    // Pošlji urejene podatke na strežnik
    axios.put(`https://evidenca-back-end.onrender.com/projects/${selectedProject.id}`, {
      priority: editedPriority,
      status: editedStatus,
      progress: editedProgress,
    })
      .then(response => {
        // Osvežimo projekte
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === selectedProject.id
              ? { ...project, priority: editedPriority, status: editedStatus, progress: editedProgress }
              : project
          )
        );
        setShowModal(false);
      })
      .catch(error => {
        console.error('Napaka pri posodabljanju projekta:', error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setChatMessage("");
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <h3>Rezervacija</h3>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <h4>Aktivni projekti</h4>
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Projekt</th>
                <th>Prioriteta</th>
                <th>Status</th>
                <th>Napredek</th>
              </tr>
            </thead>
            <tbody>
              {activeProjects.map((project) => (
                <tr key={project.id} onClick={() => handleProjectClick(project)} style={{ cursor: "pointer" }}>
                  <td>{project.id}</td>
                  <td>{project.project_name}</td>
                  <td>
                    <Badge bg={getPriorityColor(project.priority)}>{project.priority}</Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusColor(project.status)}>{project.status}</Badge>
                  </td>
                  <td>
                    <ProgressBar
                      now={project.progress}
                      label={`${project.progress}%`}
                      className={`progress-bar-${getStatusColor(project.status)}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h4>Zaključeni in preklicani projekti</h4>
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Projekt</th>
                <th>Prioriteta</th>
                <th>Status</th>
                <th>Napredek</th>
              </tr>
            </thead>
            <tbody>
              {completedAndCanceledProjects.map((project) => (
                <tr key={project.id} onClick={() => handleProjectClick(project)} style={{ cursor: "pointer" }}>
                  <td>{project.id}</td>
                  <td>{project.project_name}</td>
                  <td>
                    <Badge bg={getPriorityColor(project.priority)}>{project.priority}</Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusColor(project.status)}>{project.status}</Badge>
                  </td>
                  <td>
                    <ProgressBar
                      now={project.progress}
                      label={`${project.progress}%`}
                      className={`progress-bar-${getStatusColor(project.status)}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal za urejanje projekta */}
      {selectedProject && (
        <Modal show={showModal} onHide={handleCloseModal} className="chat-modal">
          <Modal.Header closeButton>
            <Modal.Title>Urejanje projekta: {selectedProject.project_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="prioritySelect" className="mb-3">
                <Form.Label>Prioriteta</Form.Label>
                <Form.Select value={editedPriority} onChange={(e) => setEditedPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="statusSelect" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)}>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="progressRange" className="mb-3">
                <Form.Label>Napredek</Form.Label>
                <Form.Control
                  type="range"
                  min="0"
                  max="100"
                  value={editedProgress}
                  onChange={(e) => setEditedProgress(e.target.value)}
                />
                <Form.Text>{editedProgress}%</Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Zapri
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Shrani spremembe
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'High':
      return 'danger';
    case 'Low':
      return 'success';
    case 'Normal':
      return 'warning';
    default:
      return 'secondary';
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'In Progress':
      return 'primary';
    case 'Completed':
      return 'success';
    case 'Testing':
      return 'info';
    case 'Canceled':
      return 'danger';
    case 'Pending':
      return 'secondary';
    case 'Waiting':
      return 'warning';
    default:
      return 'secondary';
  }
}

export default Rezervacija;
