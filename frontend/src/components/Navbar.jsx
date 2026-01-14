import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { logout } from "../features/authSlice";
import { switchUserRole } from "../features/authSlice"; // ADD THIS IMPORT

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false); // ADD STATE FOR ROLE SWITCHING
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const nameInitial = user?.name ? user.name.charAt(0).toUpperCase() : null;
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setDropdownOpen(false);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
      window.location.reload();
    }
  };

  // ADD THIS FUNCTION: Handle role switching
  const handleRoleSwitch = async (newRole) => {
    if (switchingRole || role === newRole) return;
    
    try {
      setSwitchingRole(true);
      await dispatch(switchUserRole(newRole)).unwrap();
      setDropdownOpen(false);
      alert(`Switched to ${newRole} mode!`);
      window.location.reload(); // Reload to update UI with new role
    } catch (error) {
      console.error('Role switch failed:', error);
      alert('Failed to switch role. Please try again.');
    } finally {
      setSwitchingRole(false);
    }
  };

  return (
    <nav className="backdrop-blur-xl bg-white/90 border-b border-slate-200/70 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group text-slate-900 hover:text-slate-900 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-[1.05] transition-all duration-300 border-2 border-white/50">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
              <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div className="font-semibold text-xl lg:text-2xl bg-gradient-to-r from-slate-800 via-indigo-900 to-blue-900 bg-clip-text tracking-tight">
            Gig<span className="text-blue-600 font-bold">Flow</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          {/* ABOUT LINK - KEEP THIS IN MAIN NAV */}
          <Link
            to="/about"
            className="px-5 py-2.5 text-sm font-semibold text-slate-800 hover:text-blue-600 hover:bg-blue-50/80 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md group"
          >
            <svg className="w-4 h-4 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </Link>

          {user ? (
            <>
              {/* COMMON LINKS FOR ALL USERS */}
              <Link to="/" className="px-5 py-2.5 text-sm font-semibold text-slate-800 hover:text-blue-600 hover:bg-blue-50/80 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md group">
                <svg className="w-4 h-4 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>

              {/* EMPLOYER SPECIFIC LINKS */}
              {role === 'employer' && (
                <>
                  <Link to="/create-gig" className="px-5 py-2.5 text-sm font-semibold text-slate-800 hover:text-emerald-600 hover:bg-emerald-50/80 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md group">
                    <svg className="w-4 h-4 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Post Gig
                  </Link>

                  <Link to="/my-gigs" className="px-5 py-2.5 text-sm font-semibold text-slate-800 hover:text-blue-600 hover:bg-blue-50/80 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md group">
                    <svg className="w-4 h-4 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    My Gigs
                  </Link>
                </>
              )}

              {/* FREELANCER SPECIFIC LINKS */}
              {role === 'freelancer' && (
                <Link to="/my-bids" className="px-5 py-2.5 text-sm font-semibold text-slate-800 hover:text-purple-600 hover:bg-purple-50/80 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md group">
                  <svg className="w-4 h-4 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  My Bids
                </Link>
              )}

              {/* COMMON DASHBOARD FOR ALL */}
              <Link to="/dashboard" className="px-5 py-2.5 text-sm font-semibold text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md group">
                <svg className="w-4 h-4 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Dashboard
              </Link>

              {/* USER DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="flex items-center gap-2 p-2.5 hover:bg-slate-100/80 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {nameInitial ? (
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.05] transition-all duration-300 border border-white/30">
                      {nameInitial}
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <svg className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* DROPDOWN MENU - ROLE SPECIFIC */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-sm border border-slate-200/70 rounded-2xl shadow-2xl ring-1 ring-black/10 z-[9999] origin-top-right">
                    {/* User Header with Role Badge */}
                    <div className="px-5 py-4 border-b border-slate-200/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-900 text-lg">{user?.name || 'User'}</p>
                          <p className="text-sm text-slate-500">{user?.email || ''}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${role === 'employer'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                          }`}>
                          {role === 'employer' ? 'Employer' : 'Freelancer'}
                        </span>
                      </div>
                    </div>

                    {/* Role-Specific Quick Actions */}
                    <div className="px-5 py-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</p>

                      {role === 'employer' ? (
                        <Link
                          to="/create-gig"
                          className="block px-4 py-3 mb-2 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/50 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 hover:text-emerald-800 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="font-medium">Post New Gig</span>
                        </Link>
                      ) : (
                        <Link
                          to="/"  // Go to Home page
                          state={{ browseMode: true }}  // Pass state to trigger browse mode
                          className="block px-4 py-3 mb-2 bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/50 text-purple-700 hover:from-purple-100 hover:to-purple-200 hover:text-purple-800 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="font-medium">Browse Gigs</span>
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        className="block px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/50 text-blue-700 hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-medium">Go to Dashboard</span>
                      </Link>
                    </div>

                    {/* Navigation Links - REPLACED ABOUT WITH ROLE SWITCHING */}
                    <div className="px-3 py-2">
                      {/* ROLE SWITCHING SECTION - REPLACED ABOUT */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Switch Mode</p>
                        <div className="flex gap-2 px-2 mb-2">
                          <button
                            onClick={() => handleRoleSwitch('freelancer')}
                            disabled={switchingRole || role === 'freelancer'}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${role === 'freelancer'
                                ? 'bg-purple-500 text-white shadow-sm'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              } ${switchingRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {role === 'freelancer' ? '✓ Freelancer' : 'Switch to Freelancer'}
                          </button>
                          <button
                            onClick={() => handleRoleSwitch('employer')}
                            disabled={switchingRole || role === 'employer'}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${role === 'employer'
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              } ${switchingRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {role === 'employer' ? '✓ Employer' : 'Switch to Employer'}
                          </button>
                        </div>
                      </div>

                      {role === 'employer' && (
                        <Link
                          to="/my-gigs"
                          className="block px-5 py-3 text-slate-800 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          My Gigs
                        </Link>
                      )}

                      {role === 'freelancer' && (
                        <Link
                          to="/my-bids"
                          className="block px-5 py-3 text-slate-800 hover:bg-purple-50/80 hover:text-purple-600 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          My Bids
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="block px-5 py-3 text-slate-800 hover:bg-indigo-50/80 hover:text-indigo-600 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-200/30 my-1 px-3">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-slate-800 hover:bg-red-50/80 hover:text-red-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3"
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
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

      {/* Mobile Menu */}
      <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-slate-200/50 px-6 py-4">
        <div className="space-y-2">
          {/* ABOUT LINK FOR MOBILE - KEEP THIS */}
          <Link
            to="/about"
            className="block px-4 py-3 text-slate-800 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-200 flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </Link>

          {/* ADD ROLE SWITCHING TO MOBILE MENU TOO */}
          {user && (
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Switch Mode</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRoleSwitch('freelancer')}
                  disabled={switchingRole || role === 'freelancer'}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${role === 'freelancer'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    } ${switchingRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {role === 'freelancer' ? '✓ Freelancer' : 'Freelancer'}
                </button>
                <button
                  onClick={() => handleRoleSwitch('employer')}
                  disabled={switchingRole || role === 'employer'}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${role === 'employer'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    } ${switchingRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {role === 'employer' ? '✓ Employer' : 'Employer'}
                </button>
              </div>
            </div>
          )}

          {user ? (
            <>
              <Link to="/" className="block px-4 py-3 text-slate-800 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-200 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>

              {role === 'employer' && (
                <>
                  <Link to="/create-gig" className="block px-4 py-3 text-slate-800 hover:bg-emerald-50/80 hover:text-emerald-600 rounded-xl transition-all duration-200 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Post Gig
                  </Link>
                  <Link to="/my-gigs" className="block px-4 py-3 text-slate-800 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-200 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    My Gigs
                  </Link>
                </>
              )}

              {role === 'freelancer' && (
                <Link to="/my-bids" className="block px-4 py-3 text-slate-800 hover:bg-purple-50/80 hover:text-purple-600 rounded-xl transition-all duration-200 flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  My Bids
                </Link>
              )}

              <Link to="/dashboard" className="block px-4 py-3 text-slate-800 hover:bg-indigo-50/80 hover:text-indigo-600 rounded-xl transition-all duration-200 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Dashboard
              </Link>

              <Link to="/profile" className="block px-4 py-3 text-slate-800 hover:bg-indigo-50/80 hover:text-indigo-600 rounded-xl transition-all duration-200 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-slate-800 hover:bg-red-50/80 hover:text-red-600 rounded-xl transition-all duration-200 flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-4 py-3 text-slate-800 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-200 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </Link>
              <Link to="/register" className="block px-4 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 text-white rounded-xl transition-all duration-200 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}