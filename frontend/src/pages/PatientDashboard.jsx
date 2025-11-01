import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        setLoading(true);
        const appointmentsRes = await api.get('/appointments?limit=50');
        const documentsRes = await api.get('/documents?limit=50');

        const myAppts = (appointmentsRes.data.appointments || []).filter(a => a.patient && a.patient._id === user.id);
        const myDocs = (documentsRes.data.documents || []).filter(d => d.patient && d.patient.toString() === user.id);

        setAppointments(myAppts);
        setDocuments(myDocs);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, [user.id]);

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Your Dashboard</h1>

      <section>
        <h2>Upcoming Appointments</h2>
        {appointments.length === 0 ? <p>No upcoming appointments</p> : (
          <ul>
            {appointments.map(a => (
              <li key={a._id}>{a.date} {a.time} with {a.doctor?.name || 'TBA'}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Your Documents</h2>
        {documents.length === 0 ? <p>No documents</p> : (
          <ul>
            {documents.map(d => (
              <li key={d._id}>{d.title} — {d.category}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PatientDashboard;
