import { useState, useEffect } from 'react';
import api from '../utils/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patient: '', doctor: '', date: '', time: '', reason: '', status: 'Scheduled', notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/patients'),
        api.get('/users/role/doctors')
      ]);
      setAppointments(appointmentsRes.data.appointments);
      setPatients(patientsRes.data.patients);
      setDoctors(doctorsRes.data);
    } catch (error) {
      alert('Error fetching data');
         console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await api.put(`/appointments/${editingAppointment._id}`, formData);
        alert('Appointment updated successfully');
      } else {
        await api.post('/appointments', formData);
        alert('Appointment created successfully');
      }
      setShowModal(false);
      setEditingAppointment(null);
      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving appointment');
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patient: appointment.patient._id,
      doctor: appointment.doctor._id,
      date: appointment.date.split('T')[0],
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      alert('Appointment deleted successfully');
      fetchData();
    } catch (error) {
      alert('Error deleting appointment');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      patient: '', doctor: '', date: '', time: '', reason: '', status: 'Scheduled', notes: ''
    });
  };

  const openModal = () => {
    resetForm();
    setEditingAppointment(null);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Appointments Management</h1>
        <button className="btn-primary" onClick={openModal}>+ Schedule Appointment</button>
      </div>

      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center'}}>No appointments found</td></tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.patient?.name || 'N/A'}</td>
                    <td>{apt.doctor?.name || 'N/A'}</td>
                    <td>{formatDate(apt.date)}</td>
                    <td>{apt.time}</td>
                    <td>{apt.reason}</td>
                    <td><span className={`status-badge status-${apt.status.toLowerCase()}`}>{apt.status}</span></td>
                    <td>
                      <button className="btn-sm btn-edit" onClick={() => handleEdit(apt)}>Edit</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDelete(apt._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient *</label>
                <select value={formData.patient} onChange={(e) => setFormData({...formData, patient: e.target.value})} required>
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Doctor *</label>
                <select value={formData.doctor} onChange={(e) => setFormData({...formData, doctor: e.target.value})} required>
                  <option value="">Select Doctor</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>{d.name} - {d.specialization}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Reason *</label>
                <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;