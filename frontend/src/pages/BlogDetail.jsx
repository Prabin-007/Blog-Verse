import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate=useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [fixingGrammar, setFixingGrammar] = useState(false);
  useEffect(() => {
  async function fetchBlog() {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw (data.error);
      }

      setBlog(data.blog);
      setComments(data.comments);
      setLikesCount(data.blog.likes?.length || 0);
      if (user) setLiked(data.blog.likes?.some((uid) => uid === user._id) || false);
    } catch (error) {
      console.log('fetchblog wala error',error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  fetchBlog();
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
      
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      const data = await res.json();

      setComments((prev) => [data.comment, ...prev]);
      setContent("");
    } catch {
      setError("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleLike = async () => {
    if (!user) { navigate("/signin"); return; }
    try {
      const res = await fetch(`/api/blogs/${id}/like`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) return;
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch {
      // silently ignore — non-critical action
    }
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const res = await fetch(`/api/ai/summarize/${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to summarize"); return; }
      setSummary(data.summary);
    } catch {
      setError("Failed to summarize blog.");
    } finally {
      setSummarizing(false);
    }
  };

  const handleGrammarFix = async () => {
    setFixingGrammar(true);
    try {
      const res = await fetch(`/api/ai/grammar-fix/${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to fix grammar"); return; }
      console.log(data);
      setBlog(data.blog);   
    } catch {
      setError("Failed to fix grammar.");
    } finally {
      setFixingGrammar(false);
    }
  };

  const handleDeleteBlog = async(e)=>{
    e.preventDefault();
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw (error);
      }
      navigate("/");
    }
    catch(error) {
      setError(error||"Failed to delete post.");
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
  if(error) return (
    <div className="page">
      <Navbar />
      <div className="not-found">{error}</div>
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
            {user && (blog.createdBy?._id === user._id || user.role?.toString()==="ADMIN") && (
              <div className="delete-blog">
                <button className="delete-blog-button" onClick={handleDeleteBlog}>delete</button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="blog-actions">
            <button className={`like-btn ${liked ? "liked" : ""}`} onClick={handleLike}>
              {liked ? "♥" : "♡"} {likesCount}
            </button>
            <button className="ai-btn" onClick={handleSummarize} disabled={summarizing}>
              {summarizing ? "Summarizing…" : "Summarize"}
            </button>
            {user && blog.createdBy?._id === user._id && (
              <button className="ai-btn" onClick={handleGrammarFix} disabled={fixingGrammar}>
                {fixingGrammar ? "Fixing…" : "Fix Grammar"}
              </button>
            )}
            {user && blog.createdBy?._id === user._id && (
              <button className="edit-btn" onClick={() => navigate(`/blog/edit/${id}`)}>
                Edit
              </button>
            )}
          </div>

          {summary && (
            <div className="ai-summary-box">
              <strong>Summary:</strong>
              <p>{summary}</p>
            </div>
          )}
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
