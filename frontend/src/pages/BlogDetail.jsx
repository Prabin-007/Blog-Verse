import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./BlogDetail.css";

const Avatar = ({ name, url }) => {
  if (url) return <img src={url} alt={name} className="avatar-img" />;
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  return <span className="avatar-initials">{initials}</span>;
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/blogs/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setBlog(data.blog);
        setComments(data.comments);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setComments((prev) => [data.comment, ...prev]);
      setContent("");
    } catch {
      setError("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="page">
      <Navbar />
      <div className="loader-wrap"><div className="loader" /></div>
    </div>
  );

  if (!blog) return (
    <div className="page">
      <Navbar />
      <div className="not-found">Blog not found.</div>
    </div>
  );

  return (
    <div className="page">
      <Navbar />
      <div className="blog-wrap">

        {/* Cover image */}
        {blog.coverImageURL && (
          <div className="blog-cover-wrap">
            <img src={blog.coverImageURL} alt={blog.title} className="blog-cover" />
          </div>
        )}

        {/* Title + meta */}
        <div className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
          <div className="blog-meta">
            <Avatar name={blog.createdBy?.fullName} url={blog.createdBy?.profileImageURL} />
            <span className="meta-name">{blog.createdBy?.fullName}</span>
            <span className="meta-dot">·</span>
            <span className="meta-date">{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="blog-body">
          <p>{blog.body}</p>
        </div>

        <hr className="blog-divider" />

        {/* Comments */}
        <div className="comments-section">
          <h2 className="comments-title">Comments ({comments.length})</h2>

          {user && (
            <form onSubmit={handleComment} className="comment-form">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment…"
                className="comment-input"
              />
              <button type="submit" className="comment-btn" disabled={submitting}>
                {submitting ? "Posting…" : "Post"}
              </button>
            </form>
          )}

          {error && <div className="auth-error" style={{ marginTop: "0.75rem" }}>{error}</div>}

          <div className="comment-list">
            {comments.length === 0 && (
              <p className="no-comments">No comments yet. Be the first.</p>
            )}
            {comments.map((c) => (
              <div key={c._id} className="comment">
                <Avatar name={c.createdBy?.fullName} url={c.createdBy?.profileImageURL} />
                <div className="comment-content">
                  <span className="comment-author">{c.createdBy?.fullName}</span>
                  <p className="comment-text">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
