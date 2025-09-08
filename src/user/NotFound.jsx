import React from 'react';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';

export default function NotFoundPage() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    // In a real app, you'd use your router's navigation
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8 mt-10">
          <h1 className="text-9xl md:text-[12rem] font-bold text-blue-200 leading-none select-none">
            404
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <p className="text-gray-500">
              The page might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            
            {/* <button
              onClick={handleGoHome}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-blue-50 text-blue-600 font-medium rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button> */}
          </div>

          {/* Help Section */}
          {/* <div className="border-t border-blue-100 pt-6">
            <p className="text-gray-600 mb-4">
              Still need help? Try these options:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a 
                href="/sitemap" 
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Browse Sitemap
              </a>
              <span className="hidden sm:inline text-gray-300">•</span>
              <a 
                href="/search" 
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Search Site
              </a>
              <span className="hidden sm:inline text-gray-300">•</span>
              <a 
                href="/contact" 
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1 justify-center"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </a>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          Error Code: 404 | Page Not Found
        </div>
      </div>
    </div>
  );
}