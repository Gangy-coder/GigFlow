import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      // get gigs owned by me
      const gigs = await api.get("/gigs?q=");
      const myGigs = gigs.data.filter(g => g.ownerId);
      const bids = [];

      for (const gig of myGigs) {
        const res = await api.get(`/bids/${gig._id}`);
        bids.push(...res.data.map(b => ({...b, gigTitle: gig.title})));
      }

      setData(bids);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-indigo-700">Dashboard — Your Gig Bids</h1>

      {data.length === 0 && (
        <p className="text-gray-500">No bids yet.</p>
      )}

      {data.map(b => (
        <div key={b._id} className="bg-white shadow p-4 rounded-xl flex justify-between">
          <div>
            <p className="font-medium">{b.gigTitle}</p>
            <p className="text-sm text-gray-600">{b.message}</p>
          </div>
          <p className="font-semibold text-indigo-600">₹{b.price}</p>
        </div>
      ))}
    </div>
  );
}
