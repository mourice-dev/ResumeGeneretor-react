import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FileText, Edit3, Search } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'ResumE - Build Your Professional Resume';
  }, []);

  return (
    <div className="flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="py-24 px-6 text-center border-b border-gray-100 relative">
        <div className="max-w-[800px] mx-auto z-10 relative">
          <span className="inline-block mb-6 px-4 py-1 bg-gray-100 border border-gray-200 rounded-full text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            v1.0 Released
          </span>
          <h1 className="text-6xl sm:text-8xl font-black text-black tracking-tighter leading-[0.9] mb-8">
            Build your legacy<br />
            <span className="text-gray-300">on one page.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-[600px] mx-auto font-light leading-relaxed">
            The minimalist resume builder for professionals. Focus on your content with our clean, distraction-free environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/dashboard" : "/register"} className="btn-black text-lg py-4 px-10 rounded-xl shadow-xl shadow-black/10">
              {user ? "Go to Dashboard" : "Start Building"}
            </Link>
            {!user && (
              <Link to="/login" className="btn-white text-lg py-4 px-10 rounded-xl shadow-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="group p-8 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 border border-gray-200 group-hover:bg-black group-hover:text-white transition-all">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-black">Smart Templates</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Minimalist, executive-grade templates designed to make your resume stand out.</p>
          </div>

          <div className="group p-8 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 border border-gray-200 group-hover:bg-black group-hover:text-white transition-all">
              <Edit3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-black">Live Edits</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Real-time updates as you type. See your changes reflected instantly.</p>
          </div>

          <div className="group p-8 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 border border-gray-200 group-hover:bg-black group-hover:text-white transition-all">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-black">Instant Search</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Retrieve documents quickly by date, content, or keywords.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center text-sm text-gray-400">
          <div>&copy; 2026 ResumE. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
