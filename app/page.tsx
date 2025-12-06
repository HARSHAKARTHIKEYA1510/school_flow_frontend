'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { Lock, Mail, Loader2, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email, password });
      const { data } = await api.post('/auth/login', { email, password });
      console.log('Login success:', data);

      Cookies.set('token', data.token);
      Cookies.set('role', data.role);
      console.log('Cookies set. Redirecting...');

      if (data.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/student');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-800">SchoolFlow</span>
          </div>

          {/* Welcome Text */}
          <div>
            <h2 className="text-4xl font-black text-gray-900">
              Holla,<br />Welcome Back
            </h2>
            <p className="mt-3 text-gray-500">
              Hey, welcome back to your special place
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            {/* Email Input */}
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="name@email.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••••"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Forgot Password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign Up
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Clouds */}
        <div className="absolute top-10 left-10 w-40 h-20 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute top-20 right-20 w-32 h-16 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-36 h-18 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-44 h-22 bg-white/20 rounded-full blur-2xl"></div>

        {/* Center Content */}
        <div className="relative z-10 text-center text-white">
          <div className="mb-8">
            <div className="inline-block p-6 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
              <GraduationCap className="h-32 w-32 text-white drop-shadow-2xl" />
            </div>
          </div>

          <h3 className="text-5xl font-black mb-4 drop-shadow-lg">
            Learning Made Easy
          </h3>
          <p className="text-xl text-white/90 font-medium max-w-md mx-auto">
            Access your courses, track attendance, and manage your academic journey all in one place
          </p>

          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>
    </div>
  );
}
