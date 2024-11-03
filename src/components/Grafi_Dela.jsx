import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

function Graphs() {
  const [projectData, setProjectData] = useState([]);
  const [lineData, setLineData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pridobivanje podatkov iz baze preko API-ja
    axios.get('https://evidenca-back-end.onrender.com/projects') // preveri pravilen API endpoint
      .then(response => {
        if (!response.data.error) {
          const projects = response.data.data;
          setProjectData(projects);

          // Generiranje podatkov za Line Chart
          const monthlyData = generateMonthlyData(projects);
          setLineData(monthlyData);
        } else {
          setError('Napaka pri pridobivanju podatkov iz baze');
        }
      })
      .catch(error => {
        console.error('Napaka pri pridobivanju podatkov:', error);
        setError('Napaka pri komunikaciji s strežnikom');
      });
  }, []);

  // Funkcija za ustvarjanje podatkov za Line Chart
  const generateMonthlyData = (projects) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep'];
    const newUsers = [65, 59, 80, 81, 56, 55, 40, 65, 70]; // Mock data za nove uporabnike

    return {
      labels: months,
      datasets: [
        {
          label: 'New Users',
          data: newUsers, // Uporabljamo mock podatke
          borderColor: '#6f42c1',
          backgroundColor: 'rgba(111, 66, 193, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6f42c1',
        },
      ],
    };
  };

  // Priprava podatkov za Pie Chart
  const getStatusCount = (status) => {
    return projectData.filter(project => project.status === status).length;
  };

  const pieData = {
    labels: ['Zaključeni', 'V teku', 'Preklicani'],
    datasets: [
      {
        label: 'Projekti',
        data: [
          getStatusCount('Completed') || 0, // Zaključeni
          getStatusCount('In Progress') || 0, // V teku
          getStatusCount('Canceled') || 0 // Preklicani
        ],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = pieData.labels[tooltipItem.dataIndex] || '';
            const value = pieData.datasets[0].data[tooltipItem.dataIndex] || 0;
            const percentage = ((value / projectData.length) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Renderiranje
  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <h3>Grafi & Diagrami</h3>
        </Col>
      </Row>
      <Row className="mt-4">
        {error ? (
          <Col>
            <p style={{ color: 'red' }}>{error}</p>
          </Col>
        ) : (
          <>
            <Col md={6}>
              <h5>Pregled projektov</h5>
              <div style={{ height: '300px' }}>
                {projectData.length > 0 ? (
                  <Pie data={pieData} options={pieOptions} />
                ) : (
                  <p>Nalaganje podatkov...</p>
                )}
              </div>
            </Col>
            <Col md={6}>
              <h5>Novi uporabniki po mesecih</h5>
              <div style={{ height: '300px' }}>
                {Object.keys(lineData).length > 0 ? (
                  <Line data={lineData} options={{ maintainAspectRatio: false }} />
                ) : (
                  <p>Nalaganje podatkov...</p>
                )}
              </div>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
}

export default Graphs;
