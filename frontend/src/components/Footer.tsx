import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = 'mt-12' }) => {
  return (
    <footer className={`bg-gray-600 text-gray-100 w-full ${className}`}>
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">AI Quiz Manager</h3>
            <p className="text-sm leading-relaxed text-gray-200">
              Create smart quizzes with AI, host live sessions, and track student performance — all in one platform.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><Link to="/register" className="hover:text-orange-400 transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="hover:text-orange-400 transition-colors">Sign In</Link></li>
              <li><span>AI Quiz Generation</span></li>
              <li><span>Live Quizzes</span></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><span>Documentation</span></li>
              <li><span>Help Center</span></li>
              <li><span>API Reference</span></li>
              <li><span>Release Notes</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><span>About Us</span></li>
              <li><span>Privacy Policy</span></li>
              <li><span>Terms of Service</span></li>
              <li><span>Contact</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-500 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-200">© {new Date().getFullYear()} AI Quiz Manager. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <span className="text-gray-200 hover:text-orange-400 cursor-pointer transition-colors">Privacy</span>
            <span className="text-gray-200 hover:text-orange-400 cursor-pointer transition-colors">Terms</span>
            <span className="text-gray-200 hover:text-orange-400 cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
