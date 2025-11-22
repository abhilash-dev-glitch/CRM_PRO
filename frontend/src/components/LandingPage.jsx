import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-teal-900 to-secondary text-white">
      {/* Navigation Bar */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-primary/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SwiftCRM
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2 rounded-lg font-semibold text-primary hover:text-accent transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-teal-600 hover:to-teal-400 transition duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Manage Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Business Like a Pro</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              SwiftCRM is your all-in-one solution for managing customer relationships, sales pipelines, and team productivity. Streamline your workflow and accelerate growth with intelligent tools built for modern businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-accent hover:from-teal-600 hover:to-teal-400 transition duration-200 transform hover:scale-105 gap-2"
              >
                Start Free Trial
                <span className="text-lg">→</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 border-primary text-primary hover:bg-primary/10 transition duration-200 gap-2"
              >
                Sign In
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-8 border-t border-primary/20">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold border-2 border-secondary"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-300">
                <span className="font-bold text-white">500+</span> businesses trust SwiftCRM
              </p>
            </div>
          </div>

          {/* Hero Graphic */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-teal-900/50 to-primary/50 backdrop-blur-xl rounded-2xl border border-primary/30 p-8">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {['📊 Sales', '👥 Leads', '✅ Tasks'].map((item) => (
                    <div
                      key={item}
                      className="bg-primary/20 border border-primary/30 rounded-lg p-4 text-center font-semibold text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Pipeline: $245,000</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span className="text-sm">Conversion: 23.5%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span className="text-sm">Team: 12 Members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Powerful Features for Growth
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to build better customer relationships
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '📊',
              title: 'Real-time Analytics',
              description: 'Track sales, conversion rates, and team performance with comprehensive dashboards and detailed reports.',
            },
            {
              icon: '👥',
              title: 'Lead Management',
              description: 'Organize leads, track interactions, and manage your entire sales pipeline in one intuitive platform.',
            },
            {
              icon: '⚡',
              title: 'Task Automation',
              description: 'Automate repetitive tasks, set reminders, and keep your team synchronized with smart workflows.',
            },
            {
              icon: '🔒',
              title: 'Enterprise Security',
              description: 'Bank-level security with role-based access control and data encryption to protect your business.',
            },
            {
              icon: '📈',
              title: 'Sales Pipeline',
              description: 'Visualize your sales funnel, forecast revenue, and identify bottlenecks with advanced analytics.',
            },
            {
              icon: '✅',
              title: 'Team Collaboration',
              description: 'Keep teams aligned with shared pipelines, notes, and activity tracking across departments.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-teal-900/40 to-primary/40 backdrop-blur-md rounded-2xl border border-primary/20 p-8 hover:border-primary/60 transition duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-0 group-hover:opacity-5 transition duration-300"></div>
              <div className="relative">
                <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { number: '99.9%', label: 'Uptime SLA' },
            { number: '500+', label: 'Active Users' },
            { number: '50M+', label: 'Leads Managed' },
            { number: '4.9★', label: 'User Rating' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-teal-900/40 to-primary/40 backdrop-blur-md rounded-2xl border border-primary/20 p-8 text-center"
            >
              <div className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-gradient-to-r from-primary to-accent rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative px-8 sm:px-12 py-16 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-teal-100 max-w-2xl mx-auto">
              Join hundreds of companies that are already using SwiftCRM to streamline their sales process and boost revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold bg-white text-primary hover:bg-gray-100 transition duration-200 transform hover:scale-105 gap-2"
              >
                Start Your Free Trial
                <span className="text-lg">→</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 border-white text-white hover:bg-white/10 transition duration-200"
              >
                Sign In
              </Link>
            </div>
            <p className="text-sm text-teal-100">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="font-black text-lg">SwiftCRM</span>
              </div>
              <p className="text-gray-400 text-sm">
                The modern CRM platform for growing businesses.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition">Features</a></li>
                <li><a href="#" className="hover:text-primary transition">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition">About</a></li>
                <li><a href="#" className="hover:text-primary transition">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/20 pt-8 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 SwiftCRM. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-primary transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-primary transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
