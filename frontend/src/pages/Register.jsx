import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ResumE - Create Account';
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-gray-50/50">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-black tracking-tighter mb-2">Create Account</h1>
          <p className="text-sm text-gray-400 font-medium">Join ResumE and start building your legacy</p>
        </div>

        <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 text-xs font-bold rounded-xl text-center uppercase tracking-widest">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-widest">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your Full Name"
                className="input-field"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-widest">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-widest">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
            <button type="submit" className="w-full btn-black py-3 text-sm">
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
