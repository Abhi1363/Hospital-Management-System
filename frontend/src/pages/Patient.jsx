import { useState, useEffect } from 'react';
import api from '../utils/api';
import SearchBar from '../components/SearchBar';
import '../pages/Patient.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [viewPatient, setViewPatient] = useState(null);

  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '', gender: 'Male',
    bloodGroup: 'O+', address: '', medicalHistory: '', emergencyContact: ''
  });

  useEffect(() => {
    fetchPatients();
  }, [search, currentPage]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/patients?search=${search}&page=${currentPage}`);
      setPatients(response.data.patients);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      alert('Error fetching patients');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await api.put(`/patients/${editingPatient._id}`, formData);
        alert('Patient updated successfully');
      } else {
        await api.post('/patients', formData);
        alert('Patient created successfully');
      }
      setShowModal(false);
      setEditingPatient(null);
      resetForm();
      fetchPatients();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving patient');
    }
  };
const handleView = (patient) => {
  setViewPatient(patient);
};

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData(patient);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await api.delete(`/patients/${id}`);
      alert('Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      alert('Error deleting patient');
        console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', age: '', gender: 'Male',
      bloodGroup: 'O+', address: '', medicalHistory: '', emergencyContact: ''
    });
  };

  const openModal = () => {
    resetForm();
    setEditingPatient(null);
    setShowModal(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Patients Management</h1>
        <button className="btn-primary" onClick={openModal}>+ Add Patient</button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search patients..." />

      {loading ? (
        <div className="loading">Loading patients...</div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign: 'center'}}>No patients found</td></tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient._id}>
                      <td>{patient.name}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.age}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.bloodGroup}</td>
                      <td>
                        
  <button className="btn-sm btn-view" onClick={() => handleView(patient)}>View</button>
                        <button className="btn-sm btn-edit" onClick={() => handleEdit(patient)}>Edit</button>
                        <button className="btn-sm btn-delete" onClick={() => handleDelete(patient._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}

{viewPatient && (
  <div className="modal-overlay" onClick={() => setViewPatient(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>Patient Details</h2>

      <div className="patient-details">
        <p><strong>Name:</strong> {viewPatient.name}</p>
        <p><strong>Email:</strong> {viewPatient.email}</p>
        <p><strong>Phone:</strong> {viewPatient.phone}</p>
        <p><strong>Age:</strong> {viewPatient.age}</p>
        <p><strong>Gender:</strong> {viewPatient.gender}</p>
        <p><strong>Blood Group:</strong> {viewPatient.bloodGroup}</p>
        <p><strong>Address:</strong> {viewPatient.address}</p>
        <p><strong>Emergency Contact:</strong> {viewPatient.emergencyContact}</p>
        <p><strong>Medical History:</strong> {viewPatient.medicalHistory || "N/A"}</p>
      </div>

      <div className="modal-actions">
        <button className="btn-secondary" onClick={() => setViewPatient(null)}>Close</button>
      </div>
    </div>
  </div>
)}





      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender *</label>
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group *</label>
                  <select value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} required>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Address *</label>
                <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Emergency Contact *</label>
                <input type="text" value={formData.emergencyContact} onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Medical History</label>
                <textarea value={formData.medicalHistory} onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})} />
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

export default Patients;