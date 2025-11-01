import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>
          <i className="fa fa-hospital" style={{ color: "#dc3545", marginRight:"8px" }}></i>
          Hospital Management System
        </h2>
      </div>
      <div className="navbar-user">
        <span className="user-info">
          {user?.name} <span className="user-role">({user?.role})</span>
        </span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
