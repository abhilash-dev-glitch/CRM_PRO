import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Mail, Lock, User, ArrowRight, CheckCircle, Shield } from 'lucide-react';

const Register = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
  });

  const handleSubmit = async (values) => {
    try {
      // Only send name, email, and password to backend
      const { confirmPassword, ...submitData } = values;
      await axios.post('http://localhost:5001/api/auth/register', submitData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent via-primary to-teal-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-white group">
            <Briefcase className="h-10 w-10 transition-transform group-hover:scale-110" />
            <span className="text-3xl font-black">SwiftCRM</span>
          </Link>

          {/* Benefits */}
          <div className="mt-20 space-y-8">
            <div>
              <h1 className="text-5xl font-black text-white mb-4">
                Start Your Journey
              </h1>
              <p className="text-xl text-teal-100">
                Join thousands of businesses using SwiftCRM to grow faster and smarter.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: 'Secure & Private',
                  description: 'Your data is encrypted and protected with enterprise-grade security.',
                },
                {
                  icon: <CheckCircle className="h-6 w-6" />,
                  title: 'Easy Setup',
                  description: 'Get started in minutes with our intuitive onboarding process.',
                },
                {
                  icon: <Briefcase className="h-6 w-6" />,
                  title: 'All-in-One Platform',
                  description: 'Everything you need to manage your business in one place.',
                },
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4 text-white">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-teal-100 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-teal-100 text-sm">
            "The best decision we made for our sales team. SwiftCRM is incredibly powerful yet easy to use."
          </p>
          <p className="text-white font-semibold mt-2">— Michael Chen, VP of Sales at DataFlow</p>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-2xl font-black text-primary">SwiftCRM</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary/10">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-800 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:text-teal-600 transition">
                  Sign in
                </Link>
              </p>
            </div>

            <Formik
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition outline-none"
                      />
                    </div>
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition outline-none"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition outline-none"
                      />
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition outline-none"
                      />
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Terms */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                      required
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:text-teal-600 font-semibold">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary hover:text-teal-600 font-semibold">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:from-teal-600 hover:to-primary transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-primary transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
