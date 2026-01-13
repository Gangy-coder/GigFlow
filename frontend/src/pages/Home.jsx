import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGigs } from "../features/gigSlice";
import { Link, useLocation } from "react-router-dom"; // ADD useLocation
import SearchBar from "../components/SearchBar"; // Import SearchBar

export default function Home() {
  const dispatch = useDispatch();
  const location = useLocation(); // Get current location
  const [searchQuery, setSearchQuery] = useState("");
  
  // Check if we're in "browse mode" (came from Browse Gigs link)
  const isBrowseMode = location.state?.browseMode || false;
  
  const { list: gigs = [], loading, error } = useSelector((state) => ({
    list: state.gigs?.list || [],
    loading: state.gigs?.loading || false,
    error: state.gigs?.error || null
  }));

  // Filter gigs based on search query (only in browse mode)
  const filteredGigs = isBrowseMode ? 
    gigs.filter(gig => 
      searchQuery === "" || 
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gig.description && gig.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : gigs;

  useEffect(() => { 
    dispatch(getGigs()); 
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* DYNAMIC HEADER based on mode */}
        <div className="text-center mb-16">
          {isBrowseMode ? (
            // BROWSE MODE HEADER (with search)
            <>
              <h1 className="text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-8">
                Browse All Gigs
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Find the perfect freelance opportunity for your skills
              </p>
              
              {/* Search Bar - Only in browse mode */}
              <div className="flex justify-center">
                <SearchBar 
                  onSearch={setSearchQuery}
                  placeholder="Search gigs by title, description..."
                  className="mt-4"
                />
              </div>
              
              {/* Results Count - Only in browse mode */}
              {!loading && !error && (
                <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-50/50 border border-blue-200/50 rounded-full">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">
                    {filteredGigs.length} {filteredGigs.length === 1 ? 'gig' : 'gigs'} found
                    {searchQuery && ` for "${searchQuery}"`}
                  </span>
                </div>
              )}
            </>
          ) : (
            // NORMAL MODE HEADER (without search)
            <>
              <h1 className="text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-8">
                Featured Gigs
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-2">
                Discover amazing freelance opportunities tailored for you
              </p>
              {!loading && !error && gigs.length > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/50 border border-blue-200/50 rounded-full mt-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">
                    {gigs.length} {gigs.length === 1 ? 'gig' : 'gigs'} available
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Loading gigs...</h3>
            <p className="text-slate-600 max-w-sm mx-auto">
              Fetching the latest freelance opportunities for you
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Error loading gigs</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6 px-4 py-3 bg-red-50/50 border border-red-200/50 rounded-xl">
              {error}
            </p>
            <button
              onClick={() => dispatch(getGigs())}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Gigs Grid */}
        {!loading && !error && (
          <div className="grid gap-6">
            {(isBrowseMode ? filteredGigs : gigs).map((g) => (
              <Link
                to={`/gig/${g._id}`}
                key={g._id}
                className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-blue-200/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 hover:bg-white"
              >
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 pr-2">
                        {g.title}
                      </h2>
                    </div>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed line-clamp-3 group-hover:line-clamp-none">
                    {g.description}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ₹{g.budget}
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
        {!loading && !error && (isBrowseMode ? filteredGigs : gigs).length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">
              {isBrowseMode && searchQuery ? `No gigs found for "${searchQuery}"` : "No gigs available"}
            </h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              {isBrowseMode && searchQuery 
                ? "Try a different search term or browse all gigs below" 
                : "Check back later for new freelance opportunities"}
            </p>
            {isBrowseMode && searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Stats Footer - Only in browse mode */}
        {isBrowseMode && !loading && !error && gigs.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {gigs.length}
                </div>
                <div className="text-sm font-medium text-slate-700">Total Gigs</div>
              </div>
              <div className="p-6 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  ₹{gigs.reduce((sum, g) => sum + (g.budget || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm font-medium text-slate-700">Total Budget</div>
              </div>
              <div className="p-6 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {new Set(gigs.map(g => g.ownerId?._id)).size}
                </div>
                <div className="text-sm font-medium text-slate-700">Active Employers</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}