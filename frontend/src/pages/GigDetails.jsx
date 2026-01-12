import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { getBids, createBid, hireBid } from "../features/bidSlice";

export default function GigDetails() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const dispatch = useDispatch();
  const bids = useSelector((s) => s.bids.list);
  const [form, setForm] = useState({ message: "", price: "" });

  useEffect(() => {
    api.get(`/gigs?q=`).then((res) => {
      setGig(res.data.find((x) => x._id === id));
    });
    dispatch(getBids(id));
  }, []);

  const submitBid = async () => {
    await dispatch(createBid({ gigId: id, ...form }));
    dispatch(getBids(id));
  };

  const hire = async (bidId) => {
    await dispatch(hireBid(bidId));
    dispatch(getBids(id));
  };

  if (!gig) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-indigo-700">{gig.title}</h1>
        <p className="mt-2 text-gray-700">{gig.description}</p>
        <p className="mt-3 font-bold text-indigo-600">Budget: ₹{gig.budget}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="text-lg font-semibold">Place a Bid</h3>
        <input
          placeholder="Short proposal"
          className="border p-2 rounded-lg w-full"
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <input
          type="number"
          placeholder="Your price"
          className="border p-2 rounded-lg w-full"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={submitBid}>
          Submit Bid
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-indigo-700">Bids</h3>

        {bids?.map((b) => (
          <div key={b._id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
            <div>
              <p className="font-medium text-gray-800">{b.message}</p>
              <p className="text-sm text-gray-600">₹{b.price}</p>
              <p className="text-xs text-indigo-500">Status: {b.status}</p>
            </div>

            <button
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
              onClick={() => hire(b._id)}>
              Hire
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
