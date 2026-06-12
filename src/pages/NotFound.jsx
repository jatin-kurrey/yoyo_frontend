import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

function NotFound() {
  usePageTitle("Page Not Found");
    return (
        <div className="min-h-screen pt-32 pb-24 px-4 bg-gray-50/50 flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="mb-8">
                    <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase">
                        Error 404
                    </span>
                </div>

                {/* 404 Number */}
                <h1 className="text-[120px] md:text-[160px] font-black text-gray-900 leading-none tracking-tighter mb-6">
                    404
                </h1>

                {/* Message */}
                <div className="space-y-4 mb-12">
                    <h2 className="text-[2rem] md:text-5xl font-black text-gray-900 tracking-tight">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <Link
                        to="/"
                        className="group w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        <Home size={20} />
                        <span>Back to Home</span>
                    </Link>
                    
                    <button
                        onClick={() => window.history.back()}
                        className="group w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        <ArrowLeft size={20} />
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Quick links */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <h3 className="text-lg font-black text-gray-900 mb-6">Quick Links</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            to="/"
                            className="p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
                        >
                            <Home size={24} className="mx-auto mb-2 text-gray-400 group-hover:text-blue-600" />
                            <span className="text-sm font-bold text-gray-700">Home</span>
                        </Link>
                        <Link
                            to="/tickets"
                            className="p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
                        >
                            <span className="text-2xl mb-2 block">🎟️</span>
                            <span className="text-sm font-bold text-gray-700">Tickets</span>
                        </Link>
                        <Link
                            to="/gallery"
                            className="p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
                        >
                            <span className="text-2xl mb-2 block">📸</span>
                            <span className="text-sm font-bold text-gray-700">Gallery</span>
                        </Link>
                        <Link
                            to="/contact"
                            className="p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
                        >
                            <span className="text-2xl mb-2 block">📞</span>
                            <span className="text-sm font-bold text-gray-700">Contact</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
