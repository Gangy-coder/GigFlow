import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-8">
            About GigFlow
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connecting talented freelancers with clients who need their skills
          </p>
        </div>

        <div className="space-y-8">
          {/* Our Mission */}
          <section className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-slate-900">Our Mission</h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-lg">
              GigFlow connects talented freelancers with clients who need their skills. 
              We're building a platform that makes freelance work simple, transparent, and rewarding for everyone.
            </p>
          </section>

          {/* How It Works */}
          <section className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-slate-900">How It Works</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-blue-100/50 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Post a Gig</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clients post projects with detailed requirements and budget
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-emerald-100/50 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Submit Bids</h3>
                <p className="text-slate-600 leading-relaxed">
                  Freelancers submit proposals with their price and expertise
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-purple-100/50 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Hire & Work</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clients choose the best freelancer and collaborate seamlessly
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-slate-900">Contact Us</h2>
            </div>
            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed text-lg">
                Have questions or need assistance? We're here to help!
              </p>
              <div className="flex items-center gap-3 mt-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a 
                  href="mailto:support@gigflow.com" 
                  className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  support@gigflow.com
                </a>
              </div>
            </div>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                100+
              </div>
              <div className="text-sm font-medium text-slate-700">Successful Gigs</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-sm font-medium text-slate-700">Active Freelancers</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                30+
              </div>
              <div className="text-sm font-medium text-slate-700">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;