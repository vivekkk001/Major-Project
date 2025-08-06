import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Users, ArrowRight, CheckCircle, Clock, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "With blockchain enhanced integrity and top-tier security infrastructure, your data is in trusted hands",
      color: "teal",
      bgGradient: "from-teal-500/20 to-teal-600/20"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Live updates, real time tracking, and seamless resolution all made possible with SmartCivic's GPS-powered complaint monitoring.",
      color: "cyan",
      bgGradient: "from-cyan-500/20 to-cyan-600/20"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Empowering citizens through collaboration made simple with an easy-to-use interface designed for everyone",
      color: "blue",
      bgGradient: "from-blue-500/20 to-blue-600/20"
    }
  ];

  useEffect(() => {
    // Show content immediately since typing is on landing page
    setShowContent(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  // Generate floating particles
  const particles = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${Math.random() * 10 + 10}s`
      }}
    />
  ));

  const getIconColor = (color: string) => {
    switch (color) {
      case 'teal': return 'text-teal-400';
      case 'cyan': return 'text-cyan-400';
      case 'blue': return 'text-blue-400';
      default: return 'text-teal-400';
    }
  };

  const getGlowColor = (color: string) => {
    switch (color) {
      case 'teal': return 'bg-teal-400';
      case 'cyan': return 'bg-cyan-400';
      case 'blue': return 'bg-blue-400';
      default: return 'bg-teal-400';
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <Navbar />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles}
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full morph"></div>
        <div className="blob absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/5 to-cyan-400/5 rounded-full morph"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative mb-8">
              <Shield className="h-16 w-16 text-teal-400 mx-auto float" />
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-lg"></div>
            </div>
            
            <h1 className="text-5xl md:text-5xl font-bold mb-6 gradient-text">
              AI-Powered Smart City Grievance Redressal System
            </h1>

            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Report issues, track progress, and create positive change in your community with our intelligent civic platform.
            </p>

            {/* File Complaint Button - Prominently Displayed */}
            <div className="flex justify-center mb-8">
              <Link 
                to="/Login"
                className="glass glow px-10 py-5 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift ripple flex items-center space-x-3 text-xl font-medium"
              >
                <FileText className="h-6 w-6" />
                <span>File a Complaint</span>
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>

            {/* Login Buttons - Positioned Below */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <Link 
                to="/login"
                className="glass px-6 py-3 rounded-lg text-gray-300 hover:text-teal-400 transition-all hover-lift flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Citizen Login</span>
              </Link>
              
              <Link 
                to="/official/login"
                className="glass px-6 py-3 rounded-lg text-gray-300 hover:text-orange-400 transition-all hover-lift flex items-center space-x-2"
              >
                <Building2 className="h-5 w-5" />
                <span>Official Login</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-teal-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-teal-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div> */}
      </section>

      {/* Features Carousel Section - Similar to Image Style */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why SmartCivic is the Smarter Choice</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with user-friendly design to make civic engagement effortless.
            </p>
          </div>

          {/* Carousel Container - Image Style with Overlapping Cards */}
          <div className="relative max-w-6xl mx-auto h-96 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                const isActive = index === currentSlide;
                const isPrev = index === (currentSlide - 1 + features.length) % features.length;
                const isNext = index === (currentSlide + 1) % features.length;
                
                let cardClass = "absolute w-80 h-80 transition-all duration-700 ease-in-out";
                let zIndex = 1;
                let transform = "";
                let opacity = 0.3;
                
                if (isActive) {
                  cardClass += " z-30";
                  transform = "translateX(0) scale(1)";
                  opacity = 1;
                  zIndex = 30;
                } else if (isPrev) {
                  cardClass += " z-20";
                  transform = "translateX(-120px) scale(0.85) rotateY(15deg)";
                  opacity = 0.7;
                  zIndex = 20;
                } else if (isNext) {
                  cardClass += " z-20";
                  transform = "translateX(120px) scale(0.85) rotateY(-15deg)";
                  opacity = 0.7;
                  zIndex = 20;
                } else {
                  transform = "translateX(0) scale(0.7)";
                  opacity = 0.3;
                }

                return (
                  <div
                    key={index}
                    className={cardClass}
                    style={{
                      transform,
                      opacity,
                      zIndex,
                      perspective: "1000px"
                    }}
                  >
                    <div className={`glass rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center hover-lift group bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl border border-white/10`}>
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <IconComponent className={`h-16 w-16 ${getIconColor(feature.color)} group-hover:scale-110 transition-transform duration-300`} />
                          <div className={`absolute inset-0 rounded-full ${getGlowColor(feature.color)} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 glass p-4 rounded-full text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift z-40 group"
            >
              <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 glass p-4 rounded-full text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift z-40 group"
            >
              <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-12 space-x-3">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-teal-400 scale-125 shadow-lg shadow-teal-400/50' 
                    : 'bg-gray-600 hover:bg-gray-500 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-2xl p-12 glow">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of citizens who are already using SmartCivic to create positive change in their communities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/signup"
                className="glass-dark glow px-8 py-4 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift ripple flex items-center space-x-2 text-lg font-medium"
              >
                <span>Sign Up</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/login"
                className="text-gray-300 hover:text-teal-400 transition-colors flex items-center space-x-2 text-lg"
              >
                <span>Already have an account?</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;