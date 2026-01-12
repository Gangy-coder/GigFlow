import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const nameInitial = user?.name ? user.name.charAt(0).toUpperCase() : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <nav className="backdrop-blur-xl bg-white/90 border-b border-slate-200/70 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group text-slate-900 hover:text-slate-900 transition-all duration-300"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-[1.05] transition-all duration-300 border-2 border-white/50">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <div className="font-semibold text-xl lg:text-2xl bg-gradient-to-r from-slate-800 via-indigo-900 to-blue-900 bg-clip-text tracking-tight">
            Gig<span className="text-blue-600 font-bold">Flow</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-8">
          {user ? (
            <>
              {role === 'employer' && (
                <Link 
                  to="/create"
                  className="px-5 py-2.5 text-sm font-semibold text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Post Gig
                </Link>
              )}
              
              {role === 'freelancer' && (
                <Link 
                  to="/dashboard"
                  className="px-5 py-2.5 text-sm font-semibold text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  My Bids
                </Link>
              )}
              
              <Link 
                to="/dashboard"
                className="px-5 py-2.5 text-sm font-semibold text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                Dashboard
              </Link>

              {/* User Avatar - FIXED DROPDOWN */}
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2.5 hover:bg-slate-100/80 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {nameInitial ? (
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-white/30">
                      {nameInitial}
                    </div>
                  ) : (
                    <div className="w-11 h-11 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <svg className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu - ALWAYS VISIBLE WHEN CLICKED */}
                {dropdownOpen && user && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-sm border border-slate-200/70 rounded-2xl shadow-2xl py-3 z-50">
                    <div className="px-5 py-4 border-b border-slate-200/50">
                      <p className="font-semibold text-slate-900 text-base">{user.name || 'User'}</p>
                      <p className="text-sm text-slate-500 capitalize">{role || 'user'}</p>
                    </div>
                    <Link 
                      to="/profile"
                      className="block px-5 py-4 text-base text-slate-800 hover:bg-indigo-50/80 hover:text-indigo-600 rounded-xl transition-all duration-200 w-full text-left flex items-center gap-3 shadow-sm hover:shadow-md"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-4 text-base text-slate-800 hover:bg-red-50/80 hover:text-red-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="px-6 py-2.5 text-sm font-semibold text-slate-800 hover:text-blue-600 hover:bg-blue-50/80 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="px-8 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 text-white font-semibold text-sm rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2.5 hover:bg-slate-100/80 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
          <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
