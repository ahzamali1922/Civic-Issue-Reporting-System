// src/pages/About.jsx
import React from 'react';
import Navbar from '../components/ui/Navbar';
import { Info, MapPin, Camera, Activity, CheckCircle, Star, Mail, MessageSquare, Phone } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Local Resident",
    review: "This app completely changed how our neighborhood handles issues. The pothole on my street was fixed within 48 hours of reporting!",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Community Leader",
    review: "The AI classification is incredibly accurate. I love being able to track the real-time status of the complaints I've submitted.",
    rating: 5
  },
  {
    id: 3,
    name: "Amit Kumar",
    role: "Daily Commuter",
    review: "Very easy to use. I just snap a photo of garbage dumps or broken streetlights on my way to work, and the authorities actually take action.",
    rating: 4
  }
];

const steps = [
  { id: 1, title: "Spot an Issue", desc: "Find a civic problem like a pothole, water leak, or garbage accumulation.", icon: <MapPin className="w-6 h-6 text-blue-600" /> },
  { id: 2, title: "Snap & Report", desc: "Take a photo and write a short description. Our AI will auto-categorize it.", icon: <Camera className="w-6 h-6 text-purple-600" /> },
  { id: 3, title: "Authorities Assigned", desc: "The smart system instantly prioritizes and forwards it to the right department.", icon: <Activity className="w-6 h-6 text-pink-600" /> },
  { id: 4, title: "Issue Resolved", desc: "Track live updates until the problem is marked as completely resolved.", icon: <CheckCircle className="w-6 h-6 text-green-600" /> },
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-24">
        
        {/* 1. About Us Section */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
            <Info className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Us</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The Civic Issue Reporting System is a smart, AI-driven platform built to bridge the gap between citizens and local authorities. 
            Our mission is to empower everyday people to take charge of their neighborhoods by easily reporting infrastructure problems, 
            while providing government bodies with an organized, prioritized dashboard to solve them efficiently.
          </p>
        </section>

        {/* 2. How to Use Section */}
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
            
            {steps.map((step) => (
              <div key={step.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.id}. {step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. People's Reviews Section */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">What People Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-slate-50 p-6 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{review.review}"</p>
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Contact Us Section */}
        <section className="max-w-3xl mx-auto bg-gradient-to-br from-blue-900 to-purple-900 rounded-3xl p-10 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Any Issue? Contact Us</h2>
          <p className="text-blue-100 mb-8">
            Facing technical difficulties or have suggestions for our platform? Our support team is here to help you.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 flex flex-col items-center">
              <Mail className="w-6 h-6 mb-2 text-blue-300" />
              <h4 className="font-semibold text-sm mb-1">Email Support</h4>
              <p className="text-xs text-blue-100">support@civicreporter.com</p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 flex flex-col items-center">
              <Phone className="w-6 h-6 mb-2 text-blue-300" />
              <h4 className="font-semibold text-sm mb-1">Call Us</h4>
              <p className="text-xs text-blue-100">+91 1800-123-4567</p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 flex flex-col items-center">
              <MessageSquare className="w-6 h-6 mb-2 text-blue-300" />
              <h4 className="font-semibold text-sm mb-1">Live Chat</h4>
              <p className="text-xs text-blue-100">Available 9 AM - 6 PM</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default About;