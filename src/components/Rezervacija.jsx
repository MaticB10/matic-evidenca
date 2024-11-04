import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, ProgressBar, Badge, Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../styles/CustomTable.css';

function Rezervacija() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);

  // Stanja za urejanje obstoječih projektov
  const [editedPriority, setEditedPriority] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [editedProgress, setEditedProgress] = useState('');

  // Stanja za dodajanje novega projekta
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectPriority, setNewProjectPriority] = useState('Normal');
  const [newProjectStatus, setNewProjectStatus] = useState('Pending');

  useEffect(() => {
    axios.get('https://evidenca-back-end.onrender.com/projects')
      .then(response => {
        if (!response.data.error) {
          setProjects(response.data.data);
        }
      })
      .catch(error => {
        console.error('Napaka pri pridobivanju projektov:', error);
      });
  }, []);

  // Filtriramo projekte glede na njihov status
  const activeProjects = projects.filter(
    (project) => project.status !== 'Completed' && project.status !== 'Canceled'
  );
  const completedOrCanceledProjects = projects.filter(
    (project) => project.status === 'Completed' || project.status === 'Canceled'
  );

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setEditedPriority(project.priority);
    setEditedStatus(project.status);
    setEditedProgress(project.progress);
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    axios.put(`https://evidenca-back-end.onrender.com/projects/${selectedProject.id}`, {
      priority: editedPriority,
      status: editedStatus,
      progress: editedProgress,
    })
      .then(response => {
        setProjects(prevProjects =>
          prevProjects.map(project =>
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

  const handleAddProject = () => {
    axios.post('https://evidenca-back-end.onrender.com/projects', {
      project_name: newProjectName,
      priority: newProjectPriority,
      status: newProjectStatus,
      progress: 0,
    })
      .then(response => {
        setProjects([...projects, response.data.data]);
        setShowAddModal(false);
      })
      .catch(error => {
        console.error('Napaka pri dodajanju novega projekta:', error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <h3>Rezervacija</h3>
          {isAdmin && (
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              Dodaj nov projekt
            </Button>
          )}
        </Col>
      </Row>

      {/* Tabela za aktivne projekte */}
      <Row className="mt-4">
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
                <tr key={project.id} onClick={() => handleProjectClick(project)} style={{ cursor: 'pointer' }}>
                  <td>{project.id}</td>
                  <td>{project.project_name}</td>
                  <td><Badge bg={getPriorityColor(project.priority)}>{project.priority}</Badge></td>
                  <td><Badge bg={getStatusColor(project.status)}>{project.status}</Badge></td>
                  <td>
                    <ProgressBar now={project.progress} label={`${project.progress}%`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Tabela za zaključene in zavrnjene projekte */}
      <Row className="mt-4">
        <Col>
          <h4>Zaključeni in zavrnjeni projekti</h4>
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
              {completedOrCanceledProjects.map((project) => (
                <tr key={project.id} onClick={() => handleProjectClick(project)} style={{ cursor: 'pointer' }}>
                  <td>{project.id}</td>
                  <td>{project.project_name}</td>
                  <td><Badge bg={getPriorityColor(project.priority)}>{project.priority}</Badge></td>
                  <td><Badge bg={getStatusColor(project.status)}>{project.status}</Badge></td>
                  <td>
                    <ProgressBar now={project.progress} label={`${project.progress}%`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal za urejanje projekta */}
      {selectedProject && (
        <Modal show={showModal} onHide={handleCloseModal}>
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

      {/* Modal za dodajanje novega projekta */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Dodaj nov projekt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newProjectName" className="mb-3">
              <Form.Label>Ime projekta</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vnesite ime projekta"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="newProjectPriority" className="mb-3">
              <Form.Label>Prioriteta</Form.Label>
              <Form.Select value={newProjectPriority} onChange={(e) => setNewProjectPriority(e.target.value)}>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="newProjectStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={newProjectStatus} onChange={(e) => setNewProjectStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Zapri
          </Button>
          <Button variant="primary" onClick={handleAddProject}>
            Dodaj projekt
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'High': return 'danger';
    case 'Normal': return 'warning';
    case 'Low': return 'success';
    default: return 'secondary';
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'In Progress': return 'primary';
    case 'Pending': return 'secondary';
    case 'Completed': return 'success';
    case 'Canceled': return 'danger';
    default: return 'secondary';
  }
}

export default Rezervacija;
