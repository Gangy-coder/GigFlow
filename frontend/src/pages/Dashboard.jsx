import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setLoading(true);

        if (user.role === 'employer') {
          // For employers: Get bids on their gigs
          const gigsRes = await api.get("/api/gigs/user/my-gigs");
          const myGigs = gigsRes.data || [];

          const bids = [];

          for (const gig of myGigs) {
            try {
              const bidsRes = await api.get(`/api/bids/gig/${gig._id}`);
              bids.push(...bidsRes.data.map(b => ({
                ...b,
                gigTitle: gig.title,
                gigId: gig._id,
                gigStatus: gig.status
              })));
            } catch (err) {
              console.error(`Error fetching bids for gig ${gig._id}:`, err);
            }
          }

          setData(bids);
        } else if (user.role === 'freelancer') {
          // For freelancers: Get bids they submitted
          const bidsRes = await api.get("/api/bids/my-bids");
          const myBids = bidsRes.data || [];

          // Fetch gig details for each bid
          const bidsWithGigDetails = await Promise.all(
            myBids.map(async (bid) => {
              try {
                const gigRes = await api.get(`/api/gigs/${bid.gigId}`);
                return {
                  ...bid,
                  gigTitle: gigRes.data.title,
                  gigBudget: gigRes.data.budget,
                  gigStatus: gigRes.data.status,
                  gigOwner: gigRes.data.ownerId?.name || 'Unknown'
                };
              } catch (err) {
                console.error(`Error fetching gig ${bid.gigId}:`, err);
                return {
                  ...bid,
                  gigTitle: 'Unknown Gig',
                  gigBudget: 0,
                  gigStatus: 'unknown',
                  gigOwner: 'Unknown'
                };
              }
            })
          );

          setData(bidsWithGigDetails);
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view dashboard</p>
        </div>
      </div>
    );
  }

  const isEmployer = user.role === 'employer';
  const isFreelancer = user.role === 'freelancer';

  const totalBids = data.length;
  const hiredBids = data.filter(b => b.status === 'hired').length;
  const pendingBids = data.filter(b => b.status === 'pending').length;
  const totalValue = data.reduce((sum, b) => sum + parseFloat(b.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-light bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Welcome back, {user.name}! {isEmployer ? 'Manage your gigs and bids' : 'Track your bids and earnings'}
          </p>
          <div className="mt-4">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${isEmployer
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-purple-100 text-purple-800 border border-purple-200'
              }`}>
              {isEmployer ? 'Employer' : 'Freelancer'}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center group hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">{totalBids}</h3>
            <p className="text-slate-600 font-medium">
              {isEmployer ? 'Total Bids' : 'My Bids'}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center group hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">{hiredBids}</h3>
            <p className="text-slate-600 font-medium">
              {isEmployer ? 'Hired' : 'Won'}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center group hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">{pendingBids}</h3>
            <p className="text-slate-600 font-medium">Pending</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center group hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">
              ₹{totalValue.toLocaleString()}
            </h3>
            <p className="text-slate-600 font-medium">
              {isEmployer ? 'Total Value' : 'Earnings'}
            </p>
          </div>
        </div>

        {/* Bids List */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              <h2 className="text-2xl font-medium text-slate-900">
                {isEmployer ? 'Bids on Your Gigs' : 'Your Submitted Bids'}
              </h2>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="ml-3 text-slate-600 font-medium">Loading your bids...</span>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">
                {isEmployer ? 'No bids yet' : 'No bids submitted'}
              </h3>
              <p className="text-slate-600 max-w-sm mx-auto mb-6">
                {isEmployer
                  ? 'Create some gigs and watch the bids roll in!'
                  : 'Submit bids on gigs to see them here!'}
              </p>
              {isEmployer ? (
                <Link
                  to="/create-gig"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Your First Gig
                </Link>
              ) : (
                <Link
                  to="/gigs"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Browse Available Gigs
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {data.map(b => (
                <div key={b._id} className="group bg-white/60 backdrop-blur-sm border border-slate-200/50 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200/80 hover:-translate-y-1 transition-all duration-300 hover:bg-white">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-xl text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {b.gigTitle}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${b.status === 'hired'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : b.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                          {b.status?.charAt(0).toUpperCase() + b.status?.slice(1) || 'Pending'}
                        </span>
                      </div>

                      <p className="text-slate-600 leading-relaxed line-clamp-2 mb-4">
                        {b.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                          ₹{parseFloat(b.price || 0).toLocaleString()}
                        </span>

                        {isFreelancer && (
                          <>
                            <span className="text-sm text-slate-500">
                              Gig Budget: ₹{parseFloat(b.gigBudget || 0).toLocaleString()}
                            </span>
                            <span className="text-sm text-slate-500">
                              Posted by: {b.gigOwner}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${b.gigStatus === 'open'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                              }`}>
                              Gig: {b.gigStatus}
                            </span>
                          </>
                        )}

                        {isEmployer && (
                          <span className="text-sm text-slate-500">
                            By: {b.freelancerId?.name || 'Unknown'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                      <Link
                        to={`/gig/${b.gigId?._id || b.gigId}`}
                        className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
                      >
                        View Gig
                      </Link>

                      {isEmployer && b.status === 'pending' && (
                        <button
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to hire this freelancer?')) {
                              try {
                                await api.patch(`/api/bids/${b._id}/hire`);
                                alert('Freelancer hired successfully!');
                                window.location.reload();
                              } catch (error) {
                                alert('Failed to hire freelancer');
                              }
                            }
                          }}
                          className="px-4 py-2 text-sm bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
                        >
                          Hire Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}