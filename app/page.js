'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { API_URL } from '@/lib/config';
import { Lock, Mail, ArrowRight, Loader2, GraduationCap } from 'lucide-react';
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      Cookies.set('token', data.token);
      const userObj = { role: data.role, email }; 
      Cookies.set('user', JSON.stringify(userObj));
      if (data.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/student');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">SF</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to SchoolFlow</p>
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 font-medium placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 font-medium placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
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
