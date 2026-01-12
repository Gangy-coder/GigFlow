import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGig } from "../features/gigSlice";
import { useNavigate } from "react-router-dom";

export default function CreateGig() {
  const [data, setData] = useState({ title: "", description: "", budget: "" });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await dispatch(createGig(data));
    nav("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110-4m-6 8a2 2 0 100 4m0-4a2 2 0 110 4m0-4a2 2 0 100 4m0 4a2 2 0 100-4m6 0a2 2 0 100 4m0-4a2 2 0 110-4m0 4a2 2 0 100-4m0-8a2 2 0 100 4m0-4a2 2 0 110 4m0 0V4m0 2a2 2 0 100 4m0-4a2 2 0 110-4" />
            </svg>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light text-slate-900 mb-3">Post a New Gig</h2>
          <p className="text-xl text-slate-600 leading-relaxed max-w-sm mx-auto">
            Create your gig and attract top talent
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-2xl ring-1 ring-slate-200/50 space-y-8">
          
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              Gig Title
            </label>
            <input
              placeholder="Enter a compelling title for your gig"
              className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-500 focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-lg shadow-sm hover:shadow-md"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"></div>
              Description
            </label>
            <textarea
              placeholder="Describe the project requirements, deliverables, and timeline..."
              className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-500 focus:ring-3 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 resize-vertical min-h-[140px] text-base shadow-sm hover:shadow-md"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              required
            />
          </div>

          {/* Budget Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
              Budget (₹)
            </label>
            <input
              type="number"
              placeholder="Enter your budget"
              className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-500 focus:ring-3 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-lg shadow-sm hover:shadow-md"
              value={data.budget}
              onChange={(e) => setData({ ...data, budget: e.target.value })}
              required
              min="1"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group w-full bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 text-white py-5 px-8 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl focus:ring-4 focus:ring-emerald-500/50 transform hover:-translate-y-1 hover:from-emerald-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Publish Gig</span>
          </button>
        </form>

        {/* Success Preview */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Gig will appear on the homepage immediately after publishing
          </p>
        </div>
      </div>
    </div>
  );
}
