import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatDate, truncateText } from '../utils/helpers.js';
import { GIG_STATUS_COLORS } from '../utils/constants.js';

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    try {
      const response = await api.get('/api/gigs/user/my-gigs');
      setGigs(response.data);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      try {
        await api.delete(`/api/gigs/${gigId}`);
        setGigs(gigs.filter(gig => gig._id !== gigId));
      } catch (error) {
        console.error('Error deleting gig:', error);
        alert('Failed to delete gig');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your gigs..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Gigs</h1>
          <p className="text-gray-600 mt-2">
            Manage all your posted gigs in one place
          </p>
        </div>
        <Link
          to="/create-gig"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
        >
          + Create New Gig
        </Link>
      </div>

      {gigs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            No gigs posted yet
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Start by creating your first gig to find talented freelancers for your projects
          </p>
          <Link
            to="/create-gig"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200"
          >
            Create Your First Gig
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {gigs.map((gig) => (
            <div key={gig._id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{gig.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${GIG_STATUS_COLORS[gig.status]}`}>
                    {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {truncateText(gig.description, 120)}
                </p>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ${gig.budget}
                    </span>
                    <span className="text-gray-500 ml-2">budget</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(gig.createdAt)}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    to={`/gig/${gig._id}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-200"
                  >
                    View Details
                  </Link>
                  {gig.status === 'open' && (
                    <button
                      onClick={() => handleDelete(gig._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition duration-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;