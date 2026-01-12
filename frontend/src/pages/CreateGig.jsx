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
    <div className="flex justify-center mt-8">
      <form onSubmit={submit} className="w-full max-w-md bg-white shadow-lg p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold text-center text-indigo-700">Post a New Gig</h2>

        <input
          placeholder="Title"
          className="border p-2 rounded-lg w-full focus:outline-indigo-500"
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded-lg w-full min-h-28 focus:outline-indigo-500"
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />

        <input
          type="number"
          placeholder="Budget"
          className="border p-2 rounded-lg w-full focus:outline-indigo-500"
          onChange={(e) => setData({ ...data, budget: e.target.value })}
        />

        <button className="bg-indigo-600 text-white py-2 rounded-lg w-full hover:bg-indigo-700 transition">
          Publish Gig
        </button>
      </form>
    </div>
  );
}

