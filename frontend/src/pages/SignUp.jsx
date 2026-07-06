import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Auth.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: ""});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImage,setProfileImage]=useState(null);
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      fd.append("password", form.password);
      if (profileImage) fd.append("profileImage", profileImage);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {throw data.error;}
      navigate(`/signin`);

    } catch {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="auth-wrap">
        <div className="auth-card">
          <h2 className="auth-title">Create account</h2>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              <span className="field-hint">We'll never share your email with anyone else.</span>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="field">
            <label htmlFor="profileImage">Profile Picture</label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="file-input"
            />
            {profileImage && (
              <span className="file-name">{profileImage.name}</span>
            )}
          </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
