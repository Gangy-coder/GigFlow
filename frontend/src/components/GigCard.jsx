import React from 'react';
import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
  return (
    <Link to={`/gig/${gig._id}`} className="group block bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-blue-200/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 max-w-sm w-full">
      {/* Header with Status Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-1 ml-2" />
        <h3 className="text-2xl font-medium text-slate-900 group-hover:text-blue-600 line-clamp-2 pr-8 mb-1 leading-tight">
          {gig.title}
        </h3>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
          gig.status === 'open' 
            ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/50' 
            : 'bg-slate-100/80 text-slate-700 border border-slate-200/50'
        }`}>
          {gig.status}
        </span>
      </div>
      
      {/* Description */}
      <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6 group-hover:text-slate-700 transition-colors">
        {gig.description.length > 150 
          ? `${gig.description.substring(0, 150)}...` 
          : gig.description}
      </p>
      
      {/* Footer */}
      <div className="space-y-3 pt-6 border-t border-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ₹{gig.budget.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500 ml-2 block">Budget</span>
          </div>
          
          {gig.ownerId && (
            <div className="flex items-center gap-2 text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
              <div className="w-6 h-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-xs font-medium text-slate-700">
                {gig.ownerId.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="truncate">{gig.ownerId.name}</span>
            </div>
          )}
        </div>
        
        {/* Action Highlight */}
        <div className={`w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity mt-2 mb-3`} />
        
        {gig.status === 'open' && (
          <div className="group-hover:scale-105 transition-transform">
            <span className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300">
              <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Apply Now
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default GigCard;
