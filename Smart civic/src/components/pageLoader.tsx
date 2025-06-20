import React from 'react';
import { Shield } from 'lucide-react';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <Shield className="h-16 w-16 text-teal-400 mx-auto animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-xl animate-ping"></div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-gray-400 mt-4 text-sm">Loading SmartCivic...</p>
      </div>
    </div>
  );
};

export default PageLoader;