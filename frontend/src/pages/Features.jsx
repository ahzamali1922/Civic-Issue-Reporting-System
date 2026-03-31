// src/pages/Features.jsx
import React from 'react';
import Navbar from '../components/ui/Navbar';
import { Camera, Cpu, ShieldCheck, AlertTriangle, LayoutDashboard, Activity, Map } from 'lucide-react';

const featuresList = [
  {
    id: 1,
    title: "Easy Issue Reporting",
    icon: <Camera className="w-8 h-8 text-purple-600" />,
    description: "Users can quickly report civic issues such as potholes, garbage, drainage problems, water leakage, and faulty streetlights.",
    pointsTitle: "Key capabilities:",
    points: [
      "Upload issue photos",
      "Add a short description",
      "Automatically capture or select location on map",
      "Submit complaints in seconds"
    ],
    summary: "This makes it easy for citizens to participate in improving their city."
  },
  {
    id: 2,
    title: "AI-Powered Issue Classification",
    icon: <Cpu className="w-8 h-8 text-purple-600" />,
    description: "The system automatically identifies the type of civic issue using Machine Learning.",
    pointsTitle: "Technologies & Categories:",
    points: [
      "MobileNetV2 CNN for image classification",
      "TF-IDF + Logistic Regression for text analysis",
      "Hybrid prediction combining both image and text results",
      "Detects: Potholes, Garbage, Water leakage, Drainage, Streetlights"
    ],
    summary: "This reduces manual work for administrators."
  },
  {
    id: 3,
    title: "Smart Duplicate Detection",
    icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
    description: "The platform prevents duplicate reports using image similarity and location matching.",
    pointsTitle: "How it works:",
    points: [
      "Uploaded image compared with existing issue images",
      "Location proximity checked using geolocation data",
      "If the issue already exists, users are prompted to upvote the existing report"
    ],
    summary: "This helps maintain a clean and efficient database."
  },
  {
    id: 4,
    title: "AI-Based Priority Assessment",
    icon: <AlertTriangle className="w-8 h-8 text-purple-600" />,
    description: "The system automatically assigns priority to issues.",
    pointsTitle: "Priority factors include:",
    points: [
      "Type of issue & Severity level",
      "Location impact & Public safety risk",
      "Examples: Water leakage/Drainage (High), Garbage (Medium)"
    ],
    summary: "This ensures urgent problems are resolved faster."
  },
  {
    id: 5,
    title: "Admin Issue Management Dashboard",
    icon: <LayoutDashboard className="w-8 h-8 text-purple-600" />,
    description: "Authorities can efficiently manage reported issues through an admin dashboard.",
    pointsTitle: "Admin capabilities:",
    points: [
      "View all reported issues",
      "Assign issues to departments",
      "Update issue status & Track progress of complaints",
      "Monitor issue statistics"
    ],
    summary: "This helps authorities manage civic problems systematically."
  },
  {
    id: 6,
    title: "Real-Time Issue Status Updates",
    icon: <Activity className="w-8 h-8 text-purple-600" />,
    description: "Users receive live updates about their reported issues using WebSocket communication.",
    pointsTitle: "Possible status updates:",
    points: [
      "Submitted",
      "Under Review",
      "Assigned to Authority",
      "In Progress",
      "Resolved"
    ],
    summary: "Keeps citizens informed at every step of the resolution."
  },
  {
    id: 7,
    title: "Transparent Civic Issue Tracking",
    icon: <Map className="w-8 h-8 text-purple-600" />,
    description: "Users can track all civic issues in their area.",
    pointsTitle: "Benefits:",
    points: [
      "Promotes transparency in governance",
      "Encourages citizen participation",
      "Helps authorities identify high-problem zones"
    ],
    summary: "Creates a collaborative environment between citizens and government."
  }
];

const Features = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      {/* Background Ambience matches your Home component */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Powerful Features for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Smarter City</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Everything you need to report, track, and resolve civic issues efficiently and transparently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{feature.description}</p>
              
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">{feature.pointsTitle}</h4>
                <ul className="space-y-2">
                  {feature.points.map((point, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              
              <p className="text-sm font-medium text-purple-700 italic border-t border-gray-100 pt-4 mt-auto">
                {feature.summary}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Features;