import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const verifyToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/verify-token', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.valid) {
          navigate(role === 'admin' ? '/admin/manage-products' : '/client/items');
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    };

    if (token) verifyToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      const user = response.data.user;

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name || '');
      localStorage.setItem('role', user.is_admin ? 'admin' : 'client');

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      navigate(user.is_admin ? '/admin/manage-products' : '/client/items');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 font-serif px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-10 rounded-lg shadow-lg border border-blue-200"
      >
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-6">
          Tyde Homes & Sanitary Fittings
        </h1>
        <h2 className="text-2xl font-semibold text-blue-700 italic text-center mb-2">Welcome Back</h2>
        <p className="text-sm text-blue-600 text-center mb-6">
          Please enter your credentials to login
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center text-sm border border-red-300">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-blue-700 italic mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
        </div>

        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-sm font-medium text-blue-700 italic mb-2">
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-blue-500"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center text-sm text-blue-700 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 accent-blue-600"
            />
            Remember me
          </label>
          <a href="#" className="text-sm text-blue-600 hover:underline italic">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-all duration-200 flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        <p className="text-center text-sm text-blue-600 mt-6">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-700 font-medium italic hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
