import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { getBids, createBid, hireBid } from "../features/bidSlice";

export default function GigDetails() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const dispatch = useDispatch();
  const bids = useSelector((s) => s.bids.list);
  const [form, setForm] = useState({ message: "", price: "" });

  useEffect(() => {
    api.get(`/gigs?q=`).then((res) => {
      setGig(res.data.find((x) => x._id === id));
    });
    dispatch(getBids(id));
  }, []);

  const submitBid = async () => {
    await dispatch(createBid({ gigId: id, ...form }));
    dispatch(getBids(id));
  };

  const hire = async (bidId) => {
    await dispatch(hireBid(bidId));
    dispatch(getBids(id));
  };

  if (!gig) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-lg text-slate-600 font-medium">Loading gig details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Gig Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-light bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text">
                {gig.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Budget: ₹{gig.budget}
                </span>
              </div>
            </div>
          </div>
          <p className="text-lg text-slate-700 leading-relaxed max-w-3xl">
            {gig.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Place Bid Section */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"></div>
              <h3 className="text-xl font-medium text-slate-900">Place Your Bid</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Proposal Message</label>
                <textarea
                  placeholder="Tell us why you're perfect for this gig..."
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical min-h-[100px] text-sm"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Your Price</label>
                <input
                  type="number"
                  placeholder="Enter your bid price"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              
              <button
                onClick={submitBid}
                className="group w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-4 px-6 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-blue-700 focus:ring-4 focus:ring-emerald-500/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Submit Bid</span>
              </button>
            </div>
          </div>

          {/* Bids List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-light bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text mb-6 flex items-center gap-3">
              Received Bids ({bids?.length || 0})
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {bids?.map((b) => (
                <div key={b._id} className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200/80 hover:-translate-y-1 transition-all duration-300 hover:bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {b.message}
                      </p>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text">
                          ₹{b.price}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          b.status === 'hired' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => hire(b._id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-500/50 transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap flex-shrink-0 ml-4"
                      disabled={b.status === 'hired'}
                    >
                      {b.status === 'hired' ? 'Hired ✓' : 'Hire'}
                    </button>
                  </div>
                </div>
              ))}
              
              {(!bids || bids.length === 0) && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
