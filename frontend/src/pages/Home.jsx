import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGigs } from "../features/gigSlice";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  
  // Check the actual structure of your Redux state
  const { list: gigs = [], loading, error } = useSelector((state) => ({
    list: state.gigs?.list || [],
    loading: state.gigs?.loading || false,
    error: state.gigs?.error || null
  }));

  useEffect(() => { 
    dispatch(getGigs()); 
  }, [dispatch]);

  // Check if gigs is an array before mapping
  const gigsArray = Array.isArray(gigs) ? gigs : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-light bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Featured Gigs
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover amazing freelance opportunities tailored for you
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg animate-pulse">
              <svg className="w-12 h-12 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-slate-900 mb-2">Loading gigs...</h3>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-slate-900 mb-2">Error loading gigs</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6">{error}</p>
            <button
              onClick={() => dispatch(getGigs())}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Gigs Grid - Only show when not loading and no error */}
        {!loading && !error && (
          <div className="grid gap-6">
            {gigsArray.map((g) => (
              <Link
                to={`/gig/${g._id}`}
                key={g._id}
                className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-blue-200/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 hover:bg-white"
              >
                {/* Gig Content */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 pr-2">
                      {g.title}
                    </h2>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed line-clamp-3 group-hover:line-clamp-none">
                    {g.description}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ${g.budget}
                      </span>
                      <span className="text-sm text-slate-500 font-medium group-hover:text-blue-500 transition-colors">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && gigsArray.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-6l-3 3-3-3m0 0l3-3 3 3" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-slate-900 mb-2">No gigs available</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Check back later for new freelance opportunities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}