import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import api from "../utils/axios";
import "./Dashboard.css";

const TABS = ["My Blogs", "My Comments", "Liked Posts"];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState("My Blogs");
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { navigate("/signin"); return; }
    loadTab(tab);
  }, [tab, user]);

  const loadTab = async (which) => {
    setLoading(true);
    setError("");
    try {
      if (which === "My Blogs") {
        const { data } = await api.get("/users/me/blogs");
        setBlogs(data.blogs || []);
      } else if (which === "My Comments") {
        const { data } = await api.get("/users/me/comments");
        setComments(data.comments || []);
      } else {
        const { data } = await api.get("/users/me/liked");
        setLiked(data.blogs || []);
      }
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/${blogId}`);
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
    } catch {
      setError("Failed to delete blog.");
    }
  };

  if (!user) return null;

  return (
    <div className="page">
      <Navbar />
      <div className="dashboard-wrap">
        <h1 className="dashboard-title">Your Dashboard</h1>

        <div className="dashboard-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`dashboard-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {error && <div className="auth-error">{error}</div>}

        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : (
          <>
            {tab === "My Blogs" && (
              <div className="dash-list">
                {blogs.length === 0 && <p className="dash-empty">You haven't written any blogs yet.</p>}
                {blogs.map((blog) => (
                  <div key={blog._id} className="dash-item">
                    {blog.coverImageURL && (
                      <img src={blog.coverImageURL} alt="" className="dash-thumb" />
                    )}
                    <div className="dash-item-body">
                      <Link to={`/blog/${blog._id}`} className="dash-item-title">{blog.title}</Link>
                      <p className="dash-item-excerpt">
                        {blog.body.length > 90 ? blog.body.slice(0, 90) + "…" : blog.body}
                      </p>
                    </div>
                    <div className="dash-item-actions">
                      <Link to={`/blog/edit/${blog._id}`} className="dash-edit-btn">Edit</Link>
                      <button className="dash-delete-btn" onClick={() => handleDelete(blog._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "My Comments" && (
              <div className="dash-list">
                {comments.length === 0 && <p className="dash-empty">You haven't commented on anything yet.</p>}
                {comments.map((c) => (
                  <div key={c._id} className="dash-comment-item">
                    <p className="dash-comment-text">"{c.content}"</p>
                    <Link to={`/blog/${c.blogId?._id}`} className="dash-comment-link">
                      on {c.blogId?.title || "a blog"}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {tab === "Liked Posts" && (
              <div className="dash-list">
                {liked.length === 0 && <p className="dash-empty">You haven't liked any posts yet.</p>}
                {liked.map((blog) => (
                  <div key={blog._id} className="dash-item">
                    {blog.coverImageURL && (
                      <img src={blog.coverImageURL} alt="" className="dash-thumb" />
                    )}
                    <div className="dash-item-body">
                      <Link to={`/blog/${blog._id}`} className="dash-item-title">{blog.title}</Link>
                      <span className="dash-item-author">by {blog.createdBy?.fullName || "Unknown"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}