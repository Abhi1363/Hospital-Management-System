import { useState, useEffect } from 'react';
import api from '../utils/api';
import SearchBar from '../components/SearchBar';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users?search=${search}`);
      setUsers(response.data.users);
    } catch (error) {
      alert('Error fetching users');
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/users/${id}`, { isActive: !currentStatus });
      alert('User status updated');
      fetchUsers();
    } catch (error) {
      console.error(error);

    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      alert('Error deleting user');
       console.error(error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>User Management</h1>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center'}}>No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                    <td>{user.specialization || '-'}</td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleActive(user._id, user.isActive)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn-sm btn-delete" onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;