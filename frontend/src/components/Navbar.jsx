import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import "./Navbar.css";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.get("/auth/logout");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        Blog Verse
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/blog/add-new">Write</Link>
            <Link to="/dashboard">Dashboard</Link>
            <span className="nav-user">{user.fullName?.split(" ")[0]}</span>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup">Create Account</Link>
            <Link to="/signin">Sign in</Link>
          </>
        )}
      </div>
    </nav>
  );
}