import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    myAppointments: 0, 
    appointmentsToday: 0, 
    totalPatients: 0,
    pendingReviews: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appointmentsRes, patientsRes, documentsRes] = await Promise.all([
          api.get('/appointments?limit=50'),
          api.get('/patients?limit=1'),
          api.get('/documents?limit=10')
        ]);

    
        const allAppointments = appointmentsRes.data.appointments || [];
        const myAppointments = allAppointments.filter(a => a.doctor && a.doctor._id === user.id);
        
    
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        

        const upcoming = myAppointments
          .filter(apt => new Date(apt.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);

        setUpcomingAppointments(upcoming);
        
        setStats({
          myAppointments: myAppointments.length,
          appointmentsToday: myAppointments.filter(a => 
            new Date(a.date).toDateString() === today.toDateString()
          ).length,
          totalPatients: patientsRes.data.total || 0,
          pendingReviews: (documentsRes.data.documents || [])
            .filter(d => !d.isVerified && d.uploadedBy?._id === user.id).length
        });
      } catch (error) {
        console.error('Error fetching doctor stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  if (loading) return <div className="loading">Loading doctor dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="welcome-header">
        <h1>Welcome, Dr. {user?.name?.split(' ')[1]}!</h1>
        <p>Your appointments and patient overview for today</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon appointments">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <div>
              <h3>Today's Appointments</h3>
              <p className="stat-value">{stats.appointmentsToday}</p>
            </div>
          </div>
          <div className="stat-change">
            <span>{stats.appointmentsToday ? 'Appointments scheduled' : 'No appointments'}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon patients">
              <i className="fa-solid fa-user-injured"></i>
            </div>
            <div>
              <h3>Total Patients</h3>
              <p className="stat-value">{stats.totalPatients}</p>
            </div>
          </div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-up"></i>
            <span>Active patients under your care</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon doctors">
              <i className="fa-solid fa-file-medical"></i>
            </div>
            <div>
              <h3>Pending Reviews</h3>
              <p className="stat-value">{stats.pendingReviews}</p>
            </div>
          </div>
          <div className="stat-change">
            <span>Documents needing your review</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => window.location.href = '/appointments'}>
              <i className="fa-solid fa-calendar-plus"></i>
              Schedule Appointment
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/documents'}>
              <i className="fa-solid fa-file-medical"></i>
              Review Documents
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/patients'}>
              <i className="fa-solid fa-user-plus"></i>
              Patient Records
            </button>
          </div>
        </div>

        <div className="calendar-section">
          <div className="calendar-header">
            <h2>Upcoming Appointments</h2>
          </div>
          <ul className="appointment-list">
            {upcomingAppointments.length === 0 ? (
              <li className="appointment-item">
                <p>No upcoming appointments</p>
              </li>
            ) : (
              upcomingAppointments.map(apt => (
                <li key={apt._id} className="appointment-item">
                  <div className="appointment-time">
                    {new Date(apt.date).toLocaleDateString()}
                  </div>
                  <div className="appointment-info">
                    <p className="appointment-patient">{apt.patient?.name}</p>
                    <p className="appointment-type">{apt.reason}</p>
                  </div>
                  <span className={`appointment-status status-${apt.status?.toLowerCase() || 'scheduled'}`}>
                    {apt.status || 'Scheduled'}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
