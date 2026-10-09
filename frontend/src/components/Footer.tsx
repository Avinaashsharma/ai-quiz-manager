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
              <li><Link to="/teacher/quizzes/create" className="hover:text-orange-400 transition-colors">AI Quiz Generation</Link></li>
              <li><Link to="/teacher/quizzes" className="hover:text-orange-400 transition-colors">Live Quizzes</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><Link to="/info/documentation" className="hover:text-orange-400 transition-colors">Documentation</Link></li>
              <li><Link to="/info/help-center" className="hover:text-orange-400 transition-colors">Help Center</Link></li>
              <li><Link to="/info/api-reference" className="hover:text-orange-400 transition-colors">API Reference</Link></li>
              <li><Link to="/info/release-notes" className="hover:text-orange-400 transition-colors">Release Notes</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><Link to="/info/about-us" className="hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link to="/info/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/info/terms-of-service" className="hover:text-orange-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/info/contact" className="hover:text-orange-400 transition-colors">Contact</Link></li>
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
