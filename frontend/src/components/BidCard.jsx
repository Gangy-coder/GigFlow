import React from 'react';
import { formatDate } from '../utils/helpers.js';
import { BID_STATUS_COLORS } from '../utils/constants.js';

const BidCard = ({ bid, onHire, isOwner }) => {
  return (
    <div className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-emerald-200/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative">
        <div className="flex items-start gap-4">
          {/* Freelancer Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg flex-shrink-0">
            {bid.freelancerId?.name?.charAt(0)?.toUpperCase() || 'F'}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-medium text-slate-900 group-hover:text-emerald-600 truncate mb-1">
              {bid.freelancerId?.name || 'Freelancer'}
            </h3>
            <p className="text-sm text-slate-500 truncate">{bid.freelancerId?.email || 'No email'}</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <span className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wide border inline-flex items-center gap-1 ${
          bid.status === 'hired'
            ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200/50 shadow-md'
            : bid.status === 'pending'
            ? 'bg-blue-100/80 text-blue-800 border-blue-200/50 shadow-md'
            : 'bg-slate-100/80 text-slate-700 border-slate-200/50'
        }`}>
          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
        </span>
      </div>
      
      {/* Proposal Message */}
      <p className="text-slate-700 leading-relaxed line-clamp-3 mb-6 group-hover:text-slate-900 transition-colors">
        {bid.message}
      </p>
      
      {/* Footer */}
      <div className="space-y-4 pt-6 border-t border-slate-200/50">
        <div className="flex justify-between items-center">
          {/* Price */}
          <div>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              ₹{bid.price?.toLocaleString() || '0'}
            </span>
            <span className="text-sm text-slate-500 block mt-1">Bid Amount</span>
          </div>
          
          {/* Date */}
          <div className="text-sm text-slate-500 text-right">
            <div className="w-3 h-3 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full mx-auto mb-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {formatDate(bid.createdAt)}
          </div>
        </div>
        
        {/* Hire Button - Only for Owner */}
        {isOwner && bid.status === 'pending' && (
          <div className="group-hover:scale-[1.02] transition-transform">
            <button
              onClick={() => onHire(bid._id)}
              className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-3.5 px-6 rounded-xl font-semibold text-sm shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 focus:ring-4 focus:ring-emerald-500/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Hire This Freelancer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidCard;
