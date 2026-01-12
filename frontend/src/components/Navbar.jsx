import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight hover:opacity-90">
          GigFlow
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link className="hover:text-gray-200" to="/create">
            Post a Gig
          </Link>
          <Link className="hover:text-gray-200" to="/login">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
