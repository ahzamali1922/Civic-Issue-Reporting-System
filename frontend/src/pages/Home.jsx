import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Rocket, Users, Shield, ArrowRight } from 'lucide-react';
import Navbar from '../components/ui/Navbar'; 

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-hidden">
      <Navbar />

      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- Hero Section --- */}
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-600 px-4 py-2 rounded-full mb-6 shadow-sm">
            <Rocket size={18} className="text-blue-500 animate-pulse" />
            <span className="text-sm font-bold tracking-wide">AI-Powered Issue Resolution</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Report Civic <br /> Issues <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Make Your City Better
            </span>
          </h1>
          
          <p className="text-gray-600 text-lg max-w-lg leading-relaxed mb-8 opacity-0 animate-fade-in-up [animation-delay:200ms]">
            Report potholes, garbage, water leakage, and more with just a photo. 
            Our AI-powered system automatically classifies issues and ensures 
            they reach the right authorities instantly.
          </p>

          <div className="flex gap-4 opacity-0 animate-fade-in-up [animation-delay:400ms]">
            <Link to="/signup" className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-all flex items-center gap-2 group shadow-xl hover:-translate-y-1">
              Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="relative opacity-0 animate-fade-in-up [animation-delay:300ms]">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative border-[8px] border-white ring-1 ring-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1000&q=80" 
              alt="City Scenery" 
              className="w-full h-[550px] object-cover transition-transform duration-700 hover:scale-105"
            />
            
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg border border-white/50">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold text-gray-800 tracking-wide">Real-time Tracking</span>
            </div>
          </div>

          <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-5 max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="bg-blue-50 p-3.5 rounded-xl text-blue-600">
              <MapPin size={28} />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-lg">Location-Based</p>
              <p className="text-sm text-gray-500 font-medium">Auto-detection enabled</p>
            </div>
          </div>
        </div>
      </main>

      {/* --- Portal Login Options Section --- */}
      <section className="relative bg-white py-24 border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16 opacity-0 animate-fade-in-up [animation-delay:500ms]">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Access Your Portal</h2>
            <p className="text-gray-500 mt-3 text-lg">Choose your account type to securely log in and continue.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-8 opacity-0 animate-fade-in-up [animation-delay:600ms]">
            
            {/* Citizen Portal Card */}
            <Link to="/login" className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 hover:border-blue-200 transition-all duration-300 w-full md:w-1/3 flex flex-col items-center text-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-blue-50 p-5 rounded-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 relative z-10">
                <Users size={36} className="text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">Citizen Login</h3>
              <p className="text-gray-500 leading-relaxed relative z-10">Report new civic issues, track your past reports, and help improve your neighborhood.</p>
            </Link>

            {/* Authority Portal Card */}
            <Link to="/login?type=admin" className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 hover:border-purple-200 transition-all duration-300 w-full md:w-1/3 flex flex-col items-center text-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-purple-50 p-5 rounded-2xl mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 relative z-10">
                <Shield size={36} className="text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">Admin Login</h3>
              <p className="text-gray-500 leading-relaxed relative z-10">Manage incoming reports, assign field workers, and update resolution statuses in real-time.</p>
            </Link>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
