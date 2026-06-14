import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../utils/axios";
import "./Home.css";

async function getBlogs() {
  const res = await api.get("/blogs");
  return res.data.blogs;
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const Avatar = ({ name, url }) => {
  if (url) return <img src={url} alt={name} className="avatar-img" />;
  const initials = (name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return <span className="avatar-initials">{initials}</span>;
};

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogs()
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    
    <div className="home">
      <Navbar />
      <main className="main">
        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : (
          <>
            <div className="section-header">
              <h2 className="section-title">Latest Posts</h2>
              <div className="section-rule" />
            </div>

            <div className="card-grid">
              {blogs.map((blog) => (
                <article key={blog._id} className="card">
                  <div className="card-image-wrap">
                    {blog.coverImageURL && (
                      <img src={`${BASE_URL}${blog.coverImageURL}`} alt={`${BASE_URL}${blog.coverImageURL}`} className="card-img" />
                    )}
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{blog.title}</h3>
                    <p className="card-excerpt">
                      {blog.body.length > 100 ? blog.body.slice(0, 100) + "…" : blog.body}
                    </p>
                    <div className="card-footer">
                      <div className="card-meta">
                        <Avatar name={blog.createdBy?.fullName || "Unknown"} url={blog.createdBy?.profileImageURL} />
                        <div className="card-meta-text">
                          <span className="meta-name">{blog.createdBy?.fullName || "Unknown"}</span>
                          <span className="meta-date">{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                      <Link to={`/blog/${blog._id}`} className="card-link">Read →</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}