import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatDate } from '../utils/helpers.js';
import { BID_STATUS_COLORS } from '../utils/constants.js';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      const response = await api.get('/api/bids/my-bids');
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your bids..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bids</h1>

      {bids.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            No bids submitted yet
          </h2>
          <p className="text-gray-500 mb-8">
            Browse gigs and submit your first bid to get started
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200"
          >
            Browse Gigs
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bids.map((bid) => (
            <div key={bid._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {bid.gigId?.title || 'Gig'}
                  </h3>
                  <p className="text-gray-600">
                    {bid.gigId?.description ? 
                      bid.gigId.description.length > 100 
                        ? `${bid.gigId.description.substring(0, 100)}...` 
                        : bid.gigId.description
                      : 'No description'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${BID_STATUS_COLORS[bid.status]}`}>
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </span>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Your Bid Message:</h4>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                  {bid.message}
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-2xl font-bold text-blue-600">
                    ${bid.price}
                  </span>
                  <span className="text-gray-500 ml-2">bid amount</span>
                </div>
                
                <div className="text-sm text-gray-500">
                  Submitted on {formatDate(bid.createdAt)}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <Link
                  to={`/gig/${bid.gigId?._id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                >
                  View Gig Details
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;