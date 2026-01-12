import React from 'react';
import { formatDate } from '../utils/helpers.js';
import { BID_STATUS_COLORS } from '../utils/constants.js';

const BidCard = ({ bid, onHire, isOwner }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {bid.freelancerId?.name || 'Freelancer'}
          </h3>
          <p className="text-sm text-gray-500">{bid.freelancerId?.email || ''}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${BID_STATUS_COLORS[bid.status]}`}>
          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
        </span>
      </div>
      
      <p className="text-gray-700 mb-4">{bid.message}</p>
      
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold text-blue-600">
            ${bid.price}
          </span>
          <span className="text-gray-500 ml-2">bid</span>
        </div>
        
        <div className="text-sm text-gray-500">
          {formatDate(bid.createdAt)}
        </div>
      </div>
      
      {isOwner && bid.status === 'pending' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onHire(bid._id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition duration-200"
          >
            Hire This Freelancer
          </button>
        </div>
      )}
    </div>
  );
};

export default BidCard;