import React, { useState } from 'react';
import { Mail, Lock, User, GraduationCap, Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      const result = await login({ email, password });
      setIsLoading(false);
      if (result.success) {
        onClose();
      } else {
        alert(result.error || 'Login failed');
      }
    }
  };

  const quickLogin = async (role) => {
    const credentials = {
      email: `${role}@example.com`,
      password: 'password'
    };
    setIsLoading(true);
    const result = await login(credentials);
    setIsLoading(false);
    if (result.success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="sm">
      <Modal.Header onClose={onClose}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to RiseGen</h2>
          <p className="text-gray-600 mt-2">Sign in to continue your learning journey</p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Or try demo accounts</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => quickLogin('student')}
            disabled={isLoading}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-300 disabled:opacity-50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Demo Student</h3>
                <p className="text-sm text-gray-600">student@example.com</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => quickLogin('instructor')}
            disabled={isLoading}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-300 rounded-xl p-4 transition-all duration-300 disabled:opacity-50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Demo Instructor</h3>
                <p className="text-sm text-gray-600">instructor@example.com</p>
              </div>
            </div>
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;