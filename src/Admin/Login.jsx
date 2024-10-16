import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { logo } from '../assets/images';
import axiosInstance from '../Hooks/Axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons for success/error toasts

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Check if the user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const ability = localStorage.getItem('ability');

    // If token and role exist, redirect to the appropriate dashboard
    if (token && ability) {
      if (ability === 'admin') {
        navigate('/dashboard'); // Redirect to admin dashboard
      } else if (ability === 'user') {
        navigate('/user-dashboard'); // Redirect to user dashboard
      }
    }
  }, [navigate]); // Run only once on component mount

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Post the login data
      const response = await axiosInstance.post('/login', formData);
  
      if (response.data.success) { // Check if login was successful
        const token = response.data.token; // Get the token from the response
        const ability = response.data.ability; // Get the user role (ability)
        const user = response.data.data; // Get the user details from the response
  
        // Save the token, ability, and user in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('ability', ability);
        localStorage.setItem('user', user);

        toast.success(
          <div className="flex items-center">
            <FaCheckCircle className="text-white bg-green-500 rounded-full mr-2 p-1" />
            {response.data.message}
          </div>,
          { position: 'top-center' }
        );
        // Redirect based on user ability (role)
        if (ability === 'admin' && token) {
          navigate('/dashboard');
        } else if (ability == 'user' && token) {
          navigate('/user-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError();
        toast.error(
          <div className="flex items-center">
              <FaTimesCircle className="text-white bg-red-500 rounded-full mr-2 p-1" />
              {response.data.message || 'Login failed. Please try again.'}
          </div>,
          { position: 'top-center' }
      );
      }
  
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(
        <div className="flex items-center">
          <FaTimesCircle className="text-white bg-red-500 rounded-full mr-2 p-1" />
          {err.response?.data?.message || 'An unexpected error occurred. Please try again.'}
        </div>,
        { position: 'top-center' }
      );
    }finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-3">
      {/* Toast Container for displaying messages */}
      <ToastContainer autoClose={5000} hideProgressBar={true} newestOnTop={true} closeOnClick pauseOnHover draggable />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <Link to={'/'}>
          <img src={logo} alt="Logo" className="w-32" />
          </Link>
        </div>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">Login</h2>
        
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
