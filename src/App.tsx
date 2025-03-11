import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Github, Menu, X } from 'lucide-react';
import GithubPagesBuilder from './pages/GithubPagesBuilder';
import ImageHosting from './pages/ImageHosting';
import LandingPage from './pages/LandingPage';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-indigo-50 text-indigo-600' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
      }`}
    >
      {children}
    </Link>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-4 text-gray-900 font-bold hover:text-indigo-600 transition-colors duration-200"
                >
                  <Github className="h-6 w-6" />
                  <span>GitHub Tools</span>
                </Link>
                <div className="hidden md:flex md:space-x-2 ml-4">
                  <NavLink to="/pages-builder">Pages Builder</NavLink>
                  <NavLink to="/image-hosting">CDN Image Hosting</NavLink>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/pages-builder"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Pages Builder
              </Link>
              <Link
                to="/image-hosting"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                CDN Image Hosting
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pages-builder" element={<GithubPagesBuilder />} />
            <Route path="/image-hosting" element={<ImageHosting />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Github className="h-5 w-5 text-gray-600" />
              <a
                href="https://github.com/YoshCasaster"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Created by YoshCasaster
              </a>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 GitHub Tools. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}