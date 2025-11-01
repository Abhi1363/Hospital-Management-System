import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
 <NavLink to="/dashboard">
  <i className="fa fa-chart-line"></i> Dashboard
</NavLink>

<NavLink to="/patients">
  <i className="fa fa-users"></i> Patients
</NavLink>

<NavLink to="/appointments">
  <i className="fa fa-calendar-check"></i> Appointments
</NavLink>

<NavLink to="/documents">
  <i className="fa fa-file-alt"></i> Documents
</NavLink>

{user?.role === 'admin' && (
  <NavLink to="/users">
    <i className="fa fa-user-shield"></i> Users
  </NavLink>
)}
      </nav>
    </aside>
  );
};

export default Sidebar;