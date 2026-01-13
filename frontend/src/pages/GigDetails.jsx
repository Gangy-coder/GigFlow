import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { getBids, createBid, hireBid } from "../features/bidSlice";

export default function GigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ message: "", price: "" });
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const bids = useSelector((s) => s.bids.list);
  const bidsLoading = useSelector((s) => s.bids.loading);

  // Fetch gig details
  useEffect(() => {
    let isActive = true;
    
    const fetchGig = async () => {
      if (!id) return;
      
      try {
        console.log(`Fetching gig: ${id}`);
        const res = await api.get(`/api/gigs/${id}`);
        console.log('Gig loaded successfully:', res.data);
        
        if (isActive) {
          setGig(res.data);
          setError(null);
          setLoading(false);
          
          // Fetch bids after gig is loaded
          dispatch(getBids(id));
        }
      } catch (err) {
        console.error("Error fetching gig:", err);
        
        if (isActive) {
          setError(err.response?.data?.error || "Failed to load gig");
          setLoading(false);
        }
      }
    };

    fetchGig();
    
    // Cleanup function
    return () => {
      isActive = false;
    };
  }, [id, dispatch]);

  // Submit bid
  const submitBid = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!form.message.trim() || !form.price.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await dispatch(createBid({ 
        gigId: id, 
        message: form.message, 
        price: parseFloat(form.price) 
      })).unwrap();
      
      setForm({ message: "", price: "" });
      alert("Bid submitted successfully!");
      dispatch(getBids(id));
    } catch (err) {
      console.error("Failed to submit bid:", err);
      alert(err?.message || "Failed to submit bid");
    }
  };

  // Hire freelancer
  const hire = async (bidId) => {
    const isOwner = (gig?.ownerId?._id === user?._id) || (gig?.ownerId === user?._id);
    
    if (!isOwner) {
      alert('❌ Only the gig owner can hire freelancers');
      return;
    }
    
    if (gig?.status !== 'open') {
      alert('❌ This gig is already assigned');
      return;
    }
    
    if (!window.confirm('Are you sure you want to hire this freelancer?')) {
      return;
    }
    
    try {
      const result = await dispatch(hireBid(bidId)).unwrap();
      
      if (result.success || result.bid) {
        alert('✅ Freelancer hired successfully!');
        
        // Update local state
        setGig(prev => ({ ...prev, status: 'assigned' }));
        
        // Refresh bids
        dispatch(getBids(id));
        
        // Refresh gig data
        try {
          const updatedGigRes = await api.get(`/api/gigs/${id}`);
          setGig(updatedGigRes.data);
        } catch (err) {
          console.log('Could not refresh gig, using local update');
        }
        
      } else {
        alert('❌ Hire failed');
      }
      
    } catch (err) {
      console.error('Hire error:', err);
      alert(err?.message || 'Failed to hire freelancer');
    }
  };

  // Helper functions
  const isFreelancer = user?.role === 'freelancer';
  const isEmployer = user?.role === 'employer';
  const isOwner = (gig?.ownerId?._id === user?._id) || (gig?.ownerId === user?._id);
  const hasBid = bids.some(bid => bid.freelancerId === user?._id);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 font-medium">Loading gig details...</p>
          <p className="text-sm text-slate-500 mt-2">ID: {id}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !gig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Gig Not Found</h2>
          <p className="text-slate-600 mb-4">{error || "The gig you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-blue-600 transition-colors mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Gig Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex-shrink-0"></div>
                <h1 className="text-3xl lg:text-4xl font-light bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {gig.title}
                </h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  gig.status === 'open' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                </span>
                
                <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Budget: ₹{gig.budget.toLocaleString()}
                </span>
                
                {gig.ownerId && (
                  <span className="text-slate-600 text-sm">
                    Posted by: <span className="font-medium">{gig.ownerId.name || 'Unknown'}</span>
                  </span>
                )}
              </div>
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Description</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {gig.description}
                </p>
              </div>
            </div>
            
            <div className="lg:text-right">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                ₹{gig.budget.toLocaleString()}
              </div>
              <div className="text-gray-500 text-sm">Total Budget</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bid Form for Freelancers */}
          {isFreelancer && (
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"></div>
                <h3 className="text-xl font-medium text-slate-900">
                  {gig.status === 'open' && !hasBid ? 'Place Your Bid' : 'Bid Status'}
                </h3>
              </div>

              {gig.status !== 'open' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-center">
                    {gig.status === 'assigned' 
                      ? "✅ This gig has been assigned to a freelancer." 
                      : "This gig is not accepting bids."}
                  </p>
                </div>
              ) : hasBid ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-800 text-center font-medium">
                    ✓ You have submitted a bid for this gig.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitBid} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Proposal Message
                    </label>
                    <textarea
                      placeholder="Tell us why you're perfect for this gig..."
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical min-h-[120px] text-sm"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Your Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter your bid price"
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-4 px-6 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-blue-700 focus:ring-4 focus:ring-emerald-500/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Submit Bid</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Employer Info Panel */}
          {isEmployer && (
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                <h3 className="text-xl font-medium text-slate-900">
                  {isOwner ? 'Your Gig Management' : 'Gig Information'}
                </h3>
              </div>
              
              {isOwner ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Gig Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      gig.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                    </span>
                  </div>
                  
                  {gig.status === 'assigned' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-green-800 text-center font-medium">
                        ✅ You have hired a freelancer for this gig.
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-slate-600 text-sm">
                      As the gig owner, you can:
                    </p>
                    <ul className="text-slate-600 text-sm mt-2 space-y-1">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        View all bids on your gig
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Hire freelancers from pending bids
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600">
                    You are viewing this gig as an employer.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bids List */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-light bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-6 flex items-center gap-3">
              Bids ({bids?.length || 0})
              {gig.status === 'assigned' && (
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Gig Assigned
                </span>
              )}
            </h3>

            {bidsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Loading bids...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {bids?.length > 0 ? (
                  bids.map((b) => (
                    <div key={b._id} className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                            {b.message}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                              ₹{b.price}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              b.status === 'hired'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {b.status?.charAt(0).toUpperCase() + b.status?.slice(1) || 'Pending'}
                            </span>
                            <span className="text-sm text-slate-500">
                              By: {b.freelancerId?.name || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        {/* Hire Button */}
                        {isOwner && gig.status === 'open' && b.status === 'pending' && (
                          <button
                            onClick={() => hire(b._id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-500/50 transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap flex-shrink-0"
                          >
                            Hire
                          </button>
                        )}
                        
                        {/* Status badges */}
                        {b.status === 'hired' && (
                          <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-medium text-sm whitespace-nowrap flex-shrink-0">
                            ✓ Hired
                          </span>
                        )}
                        {b.status === 'rejected' && (
                          <span className="px-4 py-2 bg-red-100 text-red-800 rounded-xl font-medium text-sm whitespace-nowrap flex-shrink-0">
                            ✗ Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-medium">No bids yet</p>
                    <p className="text-sm text-slate-500 mt-1">Be the first to bid on this gig!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}