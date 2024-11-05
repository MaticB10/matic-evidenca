import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const localizer = momentLocalizer(moment);

function Koledar() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
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

  const handleAddEvent = () => {
    const eventToAdd = { ...newEvent, user_id: user.id, calendar: activeCalendar };
    axios.post('https://evidenca-back-end.onrender.com/add-event', eventToAdd).then((response) => {
      if (!response.data.error) {
        setEvents([...events, {
          ...response.data.data,
          start: formatDate(response.data.data.start),
          end: formatDate(response.data.data.end),
          calendar: activeCalendar,
          user_name: `${user.name} ${user.surname}`
        }]);
        setShowModal(false);
        setNewEvent({ title: '', start: '', end: '' });
      }
    }).catch(error => {
      console.error('Napaka pri dodajanju dogodka:', error);
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent({ title: '', start: '', end: '' });
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
          {user.role !== 'user' && (
            <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
              Dodaj nov termin
            </Button>
          )}
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

      {/* Modals for adding and editing events */}
      <Modal show={showModal} onHide={handleCloseModal}>
        {/* Modal content for adding events */}
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        {/* Modal content for editing events */}
      </Modal>
    </Container>
  );
}

export default Koledar;
