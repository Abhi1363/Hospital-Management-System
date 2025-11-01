import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPatients: 0, appointmentsToday: 0, totalStaff: 0, totalDocuments: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsRes, appointmentsRes, usersRes, docsRes, recentAppointments] = await Promise.all([
          api.get('/patients?limit=1'),
          api.get('/appointments/stats/today'),
          api.get('/users?limit=1'),
          api.get('/documents?limit=1'),
          api.get('/appointments?limit=5')
        ]);

        setStats({
          totalPatients: patientsRes.data.total || 0,
          appointmentsToday: appointmentsRes.data.count || 0,
          totalStaff: usersRes.data.total || 0,
          totalDocuments: docsRes.data.total || 0
        });

        
        setRecentActivity(
          (recentAppointments.data.appointments || []).map(apt => ({
            id: apt._id,
            title: `Appointment: ${apt.patient?.name || 'Unknown Patient'}`,
            time: new Date(apt.date).toLocaleDateString(),
            type: 'appointment',
            status: apt.status
          }))
        );
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="welcome-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's what's happening at your hospital today</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card patients-card">
          <div className="stat-header">
            <div className="stat-icon patients">
              <i className="fa-solid fa-hospital-user"></i>
            </div>
            <div>
              <h3>Total Patients</h3>
              <p className="stat-value">{stats.totalPatients}</p>
            </div>
          </div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-up"></i>
            <span>4.75% from last month</span>
          </div>
        </div>

        <div className="stat-card appointments-card">
          <div className="stat-header">
            <div className="stat-icon appointments">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <div>
              <h3>Today's Appointments</h3>
              <p className="stat-value">{stats.appointmentsToday}</p>
            </div>
          </div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-up"></i>
            <span>2.4% from yesterday</span>
          </div>
        </div>

        <div className="stat-card staff-card">
          <div className="stat-header">
            <div className="stat-icon doctors">
              <i className="fa-solid fa-user-doctor"></i>
            </div>
            <div>
              <h3>Total Staff</h3>
              <p className="stat-value">{stats.totalStaff}</p>
            </div>
          </div>
          <div className="stat-change">
            <span>No change this week</span>
          </div>
        </div>

        <div className="stat-card documents-card">
          <div className="stat-header">
            <div className="stat-icon documents">
              <i className="fa-solid fa-file-medical"></i>
            </div>
            <div>
              <h3>Total Documents</h3>
              <p className="stat-value">{stats.totalDocuments}</p>
            </div>
          </div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-up"></i>
            <span>12 new today</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => window.location.href = '/users'}>
              <i className="fa-solid fa-user-plus"></i>
              Manage Staff
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/documents'}>
              <i className="fa-solid fa-file-signature"></i>
              Review Documents
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/appointments'}>
              <i className="fa-solid fa-calendar-alt"></i>
              View Schedule
            </button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            {recentActivity.map(activity => (
              <li key={activity.id} className="activity-item">
                <div className="activity-icon">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
                <span className={`appointment-status status-${activity.status?.toLowerCase() || 'scheduled'}`}>
                  {activity.status || 'Scheduled'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
