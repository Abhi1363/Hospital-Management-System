    import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  const demoAccounts = [
    { role: 'Super Admin', email: 'admin@hospital.com', password: 'admin123' },
    { role: 'Doctor', email: 'doctor@hospital.com', password: 'doctor123' },
    { role: 'Nurse', email: 'nurse@hospital.com', password: 'nurse123' },
    { role: 'Receptionist', email: 'reception@hospital.com', password: 'reception123' }
  ];

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🏥 Hospital Management System</h1>
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-accounts">
          <h3>Demo Accounts</h3>
          {demoAccounts.map((account, index) => (
            <div key={index} className="demo-account">
              <strong>{account.role}:</strong> {account.email} / {account.password}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;