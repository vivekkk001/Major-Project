import React from 'react';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-900/50 border-t border-slate-800">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob absolute -top-20 -left-20 w-40 h-40 bg-teal-500/20 rounded-full morph"></div>
        <div className="blob absolute -bottom-20 -right-20 w-32 h-32 bg-cyan-500/20 rounded-full morph"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-teal-400" />
              <span className="text-xl font-bold gradient-text">SmartCivic</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering citizens to create positive change through efficient complaint management and government transparency.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors text-sm">Home</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors text-sm">File Complaint</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors text-sm">Track Status</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors text-sm">About Us</a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors text-sm">Water Issues</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors text-sm">Road Maintenance</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors text-sm">Electricity</a>
              <a href="#" className="block text-gray-400 hover:text-teal-400 transition-colors text-sm">Public Safety</a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-teal-400" />
                <span><a href="mailto:contact@smartcivic.tech">contact@smartcivic.tech</a></span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4 text-teal-400" />
                <span><a href="tel:+919483913777">+91 9483913777</a></span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-teal-400" />
                <span>Benjanapadavu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © 2024 SmartCivic. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy-policy" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Privacy Policy</a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Terms of Service</a>
            <a href="/support" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Support</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;