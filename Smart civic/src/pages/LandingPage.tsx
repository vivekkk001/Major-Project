import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  
  const fullText = 'smartcivic.tech';
  const speed = 200;

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      // Show content after typing is complete
      setTimeout(() => setShowContent(true), 1000);
    }
  }, [currentIndex, fullText.length]);

  // Generate floating particles
  const particles = Array.from({ length: 30 }, (_, i) => (
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

  const renderText = () => {
  return displayText.split('').map((char, index) => {
    const isI = char.toLowerCase() === 'i';

    return (
      <span
        key={index}
        className={`${isI ? 'text-orange-400' : 'text-white'} animate-pulse`}
        style={{
          animationDelay: `${index * 0.1}s`,
          animationDuration: '0.5s',
          animationFillMode: 'both',
        }}
      >
        {char}
      </span>
    );
  });
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles}
        <div className="blob absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full morph"></div>
        <div className="blob absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full morph"></div>
        <div className="blob absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/5 to-cyan-400/5 rounded-full morph"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo */}
        <div className="relative mb-12">
          <Shield className="h-20 w-20 text-teal-400 mx-auto mb-8 float" />
          <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-2xl"></div>
        </div>

        {/* Typing Text */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 font-mono break-words">
            {(() => {
              const text = displayText;
              let iCount = 0;
              return text.split('').map((char, idx) => {
                let className = 'text-white';
                if (char.toLowerCase() === 'i') {
                  iCount++;
                  if (iCount === 2) {
                    className = 'text-green-400';
                  } else {
                    className = 'text-orange-400';
                  }
                }
                return (
                  <span key={idx} className={className + ' animate-pulse'}>{char}</span>
                );
              });
            })()}
            <span className="animate-pulse text-teal-400 ml-1">|</span>
          </h1>
        </div>

        {/* Content that appears after typing */}
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            AI-Powered Smart City Grievance Redressal System
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => navigate('/home')}
              className="glass glow px-8 py-4 rounded-lg text-teal-400 hover:bg-teal-400 hover:text-white transition-all hover-lift ripple text-lg font-medium"
            >
              Enter Platform
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;