import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { skuliAppLogo } from '../assets/images';
import axios from 'axios';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    // Get CSRF token
    await axios.get('http://localhost:8000/sanctum/csrf-cookie');
    
    // Post the login data
    const response = await axios.post('http://localhost:8000/api/teacher-login', formData);

    if (response.data.response) {
      const { token } = response.data; // Get the token from the response
      
      // Save the token in local storage
      localStorage.setItem('teacher_token', token);

      // Get teacher details using the token (optional, if needed)
      const teacherDetails = await axios.get('http://localhost:8000/api/teacher-details', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Teacher details:', teacherDetails.data);

      // Redirect to the dashboard
      navigate('/head-master-dashboard');
    } else {
      setError(response.data.message || 'Login failed. Please try again.');
    }

    setLoading(false);
  } catch (err) {
    setLoading(false);
    console.error('Login Error:', err);
    if (err.response && err.response.status === 401) {
      setError('Invalid credentials. Please try again.');
    } else if (err.response && err.response.data && err.response.data.message) {
      setError(err.response.data.message);
    } else {
      setError('An unexpected error occurred. Please try again later.');
    }
  }
};

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-3">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <Link to={'/'}>
          <img src={skuliAppLogo} alt="SkuliApp Logo" className="w-32" />
          </Link>
        </div>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">Teacher Login</h2>
        
        {error && <div className="text-red-600 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="text"
              placeholder="Email"
              required
              className="w-full px-10 py-3 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
              required
              className="w-full px-10 py-3 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
