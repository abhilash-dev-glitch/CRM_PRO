import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', values);
      const token = response.data.token;

      // Decode JWT to get user data
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const userData = JSON.parse(jsonPayload);
      const user = userData.user || userData;

      // Use auth context to persist user
      login(user, token);

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-teal-600 to-teal-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-white group mb-16">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition">
              <Briefcase className="h-8 w-8 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-3xl font-black">SwiftCRM</span>
          </Link>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Welcome Back to<br />SwiftCRM
              </h1>
              <p className="text-xl text-teal-100 leading-relaxed">
                Sign in to access your dashboard and continue managing your business with powerful CRM tools.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-8">
              {[
                { icon: '📊', text: 'Real-time analytics and insights' },
                { icon: '🚀', text: 'Boost productivity by 40%' },
                { icon: '🔒', text: 'Enterprise-grade security' },
                { icon: '⚡', text: 'Lightning-fast performance' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4 text-white/90 group">
                  <div className="text-3xl group-hover:scale-110 transition">{feature.icon}</div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <p className="text-white/90 text-sm italic mb-3">
            "SwiftCRM transformed our sales process. We've seen a 60% increase in conversion rates since switching!"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-white rounded-full flex items-center justify-center font-bold text-primary">
              SJ
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Sarah Johnson</p>
              <p className="text-teal-200 text-xs">CEO, TechCorp Solutions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-background to-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-2xl font-black text-primary">SwiftCRM</span>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-800 mb-2">
                Sign In
              </h2>
              <p className="text-gray-600">
                New to SwiftCRM?{' '}
                <Link to="/register" className="font-bold text-primary hover:text-teal-600 transition underline decoration-2 underline-offset-2">
                  Create an account
                </Link>
              </p>
            </div>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-xl">⚠️</span>
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition" />
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition outline-none text-gray-800 placeholder-gray-400 ${errors.email && touched.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                          }`}
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm font-medium flex items-center gap-1">
                      {msg => <><span>⚠️</span> {msg}</>}
                    </ErrorMessage>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition" />
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition outline-none text-gray-800 placeholder-gray-400 ${errors.password && touched.password
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm font-medium flex items-center gap-1">
                      {msg => <><span>⚠️</span> {msg}</>}
                    </ErrorMessage>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-primary border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-700 font-medium group-hover:text-primary transition">Remember me</span>
                    </label>
                    <a href="#" className="text-sm font-bold text-primary hover:text-teal-600 transition underline decoration-2 underline-offset-2">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:from-teal-600 hover:to-primary transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-primary transition font-medium inline-flex items-center gap-2 group">
              <span className="group-hover:-translate-x-1 transition">←</span>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
