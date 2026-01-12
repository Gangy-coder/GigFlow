import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">About GigFlow</h1>
      
      <div className="space-y-8">
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            GigFlow connects talented freelancers with clients who need their skills. 
            We're building a platform that makes freelance work simple, transparent, and rewarding for everyone.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Post a Gig</h3>
              <p className="text-gray-600 text-sm">Clients post projects with requirements and budget</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Submit Bids</h3>
              <p className="text-gray-600 text-sm">Freelancers submit proposals with their price and message</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Hire & Work</h3>
              <p className="text-gray-600 text-sm">Clients choose the best freelancer and collaborate</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact</h2>
          <p className="text-gray-600">
            Have questions? Email us at{' '}
            <a href="mailto:support@gigflow.com" className="text-blue-600 hover:underline">
              support@gigflow.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;