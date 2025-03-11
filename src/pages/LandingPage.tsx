import React from 'react';
import { FileIcon, Upload, Globe, ImageIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 animate-fade-in">
            Selamat Datang di GitHub Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up">
            Platform yang memudahkan Anda untuk mengelola dan mempublikasikan konten web serta gambar menggunakan GitHub
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* GitHub Pages Publisher Card */}
          <div className="group bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl mb-6 mx-auto transform group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              GitHub Pages Publisher
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Publikasikan website Anda dengan mudah menggunakan GitHub Pages. Upload file HTML, CSS, dan JavaScript dalam satu kali klik.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200">
                <FileIcon className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700">Upload file HTML untuk konten website</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200">
                <FileIcon className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">Tambahkan CSS untuk styling</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200">
                <FileIcon className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">Sertakan JavaScript untuk interaktivitas</span>
              </div>
            </div>
            <Link
              to="/pages-builder"
              className="mt-8 flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-center py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 group"
            >
              <span>Mulai Publikasi</span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* CDN Image Hosting Card */}
          <div className="group bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl mb-6 mx-auto transform group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                <ImageIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              CDN Image Hosting
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Hosting gambar Anda menggunakan GitHub sebagai CDN. Dapatkan URL langsung untuk setiap gambar yang Anda upload.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group-hover:bg-purple-50 transition-colors duration-200">
                <Upload className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">Upload gambar dengan mudah</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group-hover:bg-purple-50 transition-colors duration-200">
                <Globe className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">Dapatkan URL CDN langsung</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group-hover:bg-purple-50 transition-colors duration-200">
                <ImageIcon className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">Mendukung berbagai format gambar</span>
              </div>
            </div>
            <Link
              to="/image-hosting"
              className="mt-8 flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 group"
            >
              <span>Mulai Upload</span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}