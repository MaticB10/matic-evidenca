import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const localizer = momentLocalizer(moment);

function Koledar() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [activeCalendar, setActiveCalendar] = useState('Dvigalo 1');

  const formatDate = (date) => {
    if (date && !isNaN(new Date(date).getTime())) {
      return new Date(date);
    }
    return null;
  };

  useEffect(() => {
    fetchEvents();
  }, [activeCalendar]);

  const fetchEvents = () => {
    axios.get(`https://evidenca-back-end.onrender.com/events?calendar=${activeCalendar}`)
      .then(response => {
        if (!response.data.error) {
          setEvents(response.data.data.map(event => ({
            id: event.id,
            title: event.title,
            start: formatDate(event.start),
            end: formatDate(event.end),
            calendar: event.calendar,
            user_name: `${event.first_name} ${event.last_name}`
          })));
        }
      })
      .catch(error => {
        console.error('Napaka pri pridobivanju dogodkov:', error);
      });
  };

  const handleEventMouseOver = (event, e) => {
    setSelectedEvent(event);
    setPosition({
      top: e.clientY + 10,
      left: e.clientX + 10,
    });
  };

  const handleEventMouseOut = () => {
    setSelectedEvent(null);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    if (!selectedEvent || !selectedEvent.id) return;

    const updatedEvent = {
      ...selectedEvent,
      start: new Date(selectedEvent.start).toISOString(),
      end: new Date(selectedEvent.end).toISOString()
    };

    axios.put(`https://evidenca-back-end.onrender.com/update-event/${selectedEvent.id}`, updatedEvent)
      .then(response => {
        if (!response.data.error) {
          setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
          setShowEditModal(false);
        }
      })
      .catch(error => {
        console.error('Error during event update:', error);
      });
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent || !selectedEvent.id) return;

    axios.delete(`https://evidenca-back-end.onrender.com/delete-event/${selectedEvent.id}`)
      .then(response => {
        if (!response.data.error) {
          setEvents(events.filter(event => event.id !== selectedEvent.id));
          setShowEditModal(false);
          setSelectedEvent(null);
        }
      })
      .catch(error => {
        console.error('Error during event deletion:', error);
      });
  };

  const filteredEvents = events.filter(event => event.calendar === activeCalendar);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <h3>Koledar</h3>
        </Col>
      </Row>

      {/* Tabs for each calendar */}
      <Tabs activeKey={activeCalendar} onSelect={(k) => setActiveCalendar(k)} className="mb-3">
        <Tab eventKey="Dvigalo 1" title="Dvigalo 1 - Osebna vozila" />
        <Tab eventKey="Dvigalo 2" title="Dvigalo 2 - Osebna in manjša transportna vozila" />
        <Tab eventKey="Dvigalo 3" title="Dvigalo 3 - Večji kombiji in kasonarji" />
      </Tabs>

      <Row>
        <Col>
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            defaultView="month"
            views={['month', 'week', 'day']}
            onSelectEvent={(event, e) => handleEventMouseOver(event, e)}
            onMouseOut={handleEventMouseOut}
          />
        </Col>
      </Row>

      {/* Modal for editing events */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Uredi dogodek</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventTitleEdit">
              <Form.Label>Naslov</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vnesi naslov termina"
                value={selectedEvent?.title || ''}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="eventStartEdit" className="mt-3">
              <Form.Label>Začetek</Form.Label>
              <Form.Control
                type="datetime-local"
                value={selectedEvent?.start ? new Date(selectedEvent.start).toISOString().substring(0, 16) : ''}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, start: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="eventEndEdit" className="mt-3">
              <Form.Label>Konec</Form.Label>
              <Form.Control
                type="datetime-local"
                value={selectedEvent?.end ? new Date(selectedEvent.end).toISOString().substring(0, 16) : ''}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, end: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Zapri
          </Button>
          <Button variant="danger" onClick={handleDeleteEvent}>
            Izbriši dogodek
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Shrani spremembe
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Koledar;
