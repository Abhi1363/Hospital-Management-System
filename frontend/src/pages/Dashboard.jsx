import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import NurseDashboard from './NurseDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';
import PatientDashboard from './PatientDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const RoleDashboard = useMemo(() => {
    switch (user?.role) {
      case 'admin':
        return AdminDashboard;
      case 'doctor':
        return DoctorDashboard;
      case 'nurse':
        return NurseDashboard;
      case 'receptionist':
        return ReceptionistDashboard;
      case 'patient':
        return PatientDashboard;
      default:
        return null;
    }
  }, [user?.role]);

  if (!user) return <div className="loading">Loading dashboard...</div>;

  const Component = RoleDashboard;
  return Component ? <Component /> : <div>No dashboard available for your role</div>;
};

export default Dashboard;