import { useState, useEffect } from 'react';
import api from '../utils/api';

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState({ totalPatients: 0, appointmentsToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [patientsRes, appointmentsRes] = await Promise.all([
          api.get('/patients?limit=1'),
          api.get('/appointments/stats/today')
        ]);

        setStats({
          totalPatients: patientsRes.data.total || 0,
          appointmentsToday: appointmentsRes.data.count || 0
        });
      } catch (error) {
        console.error('Error fetching receptionist stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading receptionist dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Receptionist Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p className="stat-value">{stats.totalPatients}</p>
        </div>
        <div className="stat-card">
          <h3>Appointments Today</h3>
          <p className="stat-value">{stats.appointmentsToday}</p>
        </div>
      </div>

      <div className="quick-actions" style={{display:"flex", gap:"40px"}}>
        <button className="action-btn" onClick={() => window.location.href = '/patients'}>Add Patient</button>
        <button className="action-btn" onClick={() => window.location.href = '/appointments'}>Schedule Appointment</button>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
