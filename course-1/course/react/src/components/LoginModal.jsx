import React, { useState } from 'react';
import { Mail, Lock, User, GraduationCap, Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

const LoginModal = ({ onClose }) => {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login({ email, password });
    setIsLoading(false);
    if (result.success) onClose();
    else setError(result.error || 'Login failed');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    const result = await register({ name, email, password, role });
    setIsLoading(false);
    if (result.success) onClose();
    else setError(result.error || 'Registration failed');
  };

  const quickLogin = async (r) => {
    setError('');
    setIsLoading(true);
    const result = await login({ email: `${r}@example.com`, password: 'password' });
    setIsLoading(false);
    if (result.success) onClose();
    else setError(result.error || 'Login failed');
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="sm">
      <Modal.Header onClose={onClose}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to RiseGen</h2>
          <p className="text-gray-600 mt-1">Your learning journey starts here</p>
        </div>
      </Modal.Header>

      <Modal.Body>
        {/* Tabs */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'login' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >Sign In</button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'register' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
          >Create Account</button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} placeholder="Enter your email" required />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={Lock} placeholder="Enter your password" required />
              <Button type="submit" loading={isLoading} className="w-full" size="lg">Sign In</Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">Or try demo accounts</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => quickLogin('student')} disabled={isLoading}
                className="group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl p-3 transition-all disabled:opacity-50">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-800">Demo Student</p>
              </button>
              <button onClick={() => quickLogin('instructor')} disabled={isLoading}
                className="group bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-300 rounded-xl p-3 transition-all disabled:opacity-50">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-800">Demo Instructor</p>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} icon={User} placeholder="Enter your full name" required />
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} placeholder="Enter your email" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={Lock} placeholder="Min. 6 characters" required />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('student')}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold flex items-center justify-center space-x-2 ${role === 'student' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <User className="w-4 h-4" /><span>Student</span>
                </button>
                <button type="button" onClick={() => setRole('instructor')}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold flex items-center justify-center space-x-2 ${role === 'instructor' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <GraduationCap className="w-4 h-4" /><span>Instructor</span>
                </button>
              </div>
            </div>

            <Button type="submit" loading={isLoading} className="w-full" size="lg">Create Account</Button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <button type="button" onClick={() => setTab('login')} className="text-blue-600 font-semibold hover:underline">Sign in</button>
            </p>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
