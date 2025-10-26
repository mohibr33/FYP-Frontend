import React, { useState } from 'react';
import { BookOpen, Pill, BarChart3, ArrowRight } from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Helper to navigate using parent App's state
  const goTo = (page) => {
    if (onNavigate) onNavigate(page);
    else setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Everything You Need for
                <span className="block text-blue-200">Better Health</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Our comprehensive platform brings together all the tools and information you need to take control of your healthcare journey.
              </p>

              {/* ✅ Functional Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => goTo('articles')}
                  className="group bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Explore Articles
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => goTo('medicines')}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all"
                >
                  Browse Medicines
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1757152962882-6bf8495b324d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwZG9jdG9yJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjAzNTk2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Healthcare Technology"
                className="rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need for Better Health</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform brings together all the tools and information you need to take control of your healthcare journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Medical Articles</h3>
              <p className="text-gray-700 leading-relaxed">
                Access thousands of peer-reviewed articles written by healthcare professionals to stay informed about your health conditions.
              </p>
            </div>

            <div className="bg-green-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Pill className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Medicine Database</h3>
              <p className="text-gray-700 leading-relaxed">
                Comprehensive information about common medications, including dosages, side effects, and interactions to keep you well-informed.
              </p>
            </div>

            <div className="bg-purple-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Health Tracking</h3>
              <p className="text-gray-700 leading-relaxed">
                Monitor your health metrics, track medication schedules, and visualize your progress through intuitive dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients who trust Digital Health Care Assistant for their healthcare information needs. Start your journey to better health today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => goTo('signup')}
              className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => goTo('about')}
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
