import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGigs } from '../features/gigSlice';
import GigCard from '../components/GigCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

const Gigs = () => {
  const dispatch = useDispatch();
  const { list: gigs, loading, error } = useSelector((state) => state.gigs);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getGigs(searchTerm));
  }, [dispatch, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return <LoadingSpinner text="Loading gigs..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => dispatch(getGigs())}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Browse Gigs</h1>
        <p className="text-gray-600 mb-8">Find the perfect freelance opportunity</p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search gigs by title, description..."
          />
        </div>
      </div>

      {gigs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">No gigs found</h3>
          <p className="text-gray-500">Try a different search term or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Gigs;