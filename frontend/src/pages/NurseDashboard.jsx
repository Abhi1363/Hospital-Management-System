import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const NurseDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    totalDocuments: 0,
    recentPatients: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [patientsRes, appointmentsRes, docsRes] = await Promise.all([
          api.get('/patients?limit=1'),
          api.get('/appointments?limit=10'),
          api.get('/documents?limit=5')
        ]);

        const appointments = appointmentsRes.data.appointments || [];
        const todayAppointments = appointments.filter(apt => 
          new Date(apt.date).toDateString() === today.toDateString()
        );

        setStats({
          totalPatients: patientsRes.data.total || 0,
          appointmentsToday: todayAppointments.length,
          totalDocuments: docsRes.data.total || 0,
          recentPatients: patientsRes.data.patients?.slice(0, 5).length || 0
        });

        setUpcomingAppointments(appointments.slice(0, 5));
        setRecentDocuments(docsRes.data.documents || []);
      } catch (error) {
        console.error('Error fetching nurse stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading nurse dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="welcome-header">
        <h1>Welcome, Nurse {user?.name?.split(' ')[0]}!</h1>
        <p>Here's your patient care overview for today</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon patients">
              <i className="fa-solid fa-bed"></i>
            </div>
            <div>
              <h3>Total Patients</h3>
              <p className="stat-value">{stats.totalPatients}</p>
            </div>
          </div>
          <div className="stat-change positive">
            <i className="fa-solid fa-plus"></i>
            <span>{stats.recentPatients} new this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon appointments">
              <i className="fa-solid fa-calendar-day"></i>
            </div>
            <div>
              <h3>Today's Schedule</h3>
              <p className="stat-value">{stats.appointmentsToday}</p>
            </div>
          </div>
          <div className="stat-change">
            <span>Appointments today</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon documents">
              <i className="fa-solid fa-file-medical"></i>
            </div>
            <div>
              <h3>Patient Records</h3>
              <p className="stat-value">{stats.totalDocuments}</p>
            </div>
          </div>
          <div className="stat-change">
            <span>Total medical records</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => window.location.href = '/patients'}>
              <i className="fa-solid fa-user-plus"></i>
              Register Patient
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/documents'}>
              <i className="fa-solid fa-file-upload"></i>
              Upload Documents
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/appointments'}>
              <i className="fa-solid fa-calendar"></i>
              View Schedule
            </button>
          </div>
        </div>

        <div className="calendar-section">
          <div className="calendar-header">
            <h2>Today's Appointments</h2>
          </div>
          <ul className="appointment-list">
            {upcomingAppointments.length === 0 ? (
              <li className="appointment-item">
                <p>No appointments scheduled</p>
              </li>
            ) : (
              upcomingAppointments.map(apt => (
                <li key={apt._id} className="appointment-item">
                  <div className="appointment-time">
                    {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="appointment-info">
                    <p className="appointment-patient">{apt.patient?.name}</p>
                    <p className="appointment-type">with Dr. {apt.doctor?.name?.split(' ')[1]}</p>
                  </div>
                  <span className={`appointment-status status-${apt.status?.toLowerCase() || 'scheduled'}`}>
                    {apt.status || 'Scheduled'}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="recent-activity">
          <h2>Recent Documents</h2>
          <ul className="activity-list">
            {recentDocuments.map(doc => (
              <li key={doc._id} className="activity-item">
                <div className="activity-icon">
                  <i className="fa-solid fa-file-medical"></i>
                </div>
                <div className="activity-content">
                  <p className="activity-title">{doc.title}</p>
                  <p className="activity-time">Patient: {doc.patient?.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
