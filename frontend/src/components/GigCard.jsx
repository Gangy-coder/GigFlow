import React from 'react';
import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          <Link to={`/gig/${gig._id}`} className="hover:text-blue-600">
            {gig.title}
          </Link>
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          gig.status === 'open' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {gig.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {gig.description.length > 150 
          ? `${gig.description.substring(0, 150)}...` 
          : gig.description}
      </p>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-2xl font-bold text-blue-600">
            ${gig.budget.toLocaleString()}
          </span>
          <span className="text-gray-500 ml-2">budget</span>
        </div>
        
        {gig.ownerId && (
          <div className="text-sm text-gray-500">
            By {gig.ownerId.name}
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <Link
          to={`/gig/${gig._id}`}
          className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
        >
          View Details
        </Link>
        {gig.status === 'open' && (
          <Link
            to={`/gig/${gig._id}`}
            className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium"
          >
            Apply Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default GigCard;