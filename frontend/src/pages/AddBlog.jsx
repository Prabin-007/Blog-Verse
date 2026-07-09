import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/axios";
import "./AddBlog.css";

export default function AddBlog() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", body: "" });
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("body", form.body);
      if (coverImage) fd.append("coverImage", coverImage);

      const { data } = await api.post("/blogs", fd);
      navigate(`/blog/${data.blog._id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="addblog-wrap">
        <h2 className="addblog-title">Write a new post</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="addblog-form">
          <div className="field">
            <label htmlFor="coverImage">Cover Image</label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="file-input"
            />
            {coverImage && (
              <span className="file-name">{coverImage.name}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Give your post a title"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              name="body"
              value={form.body}
              onChange={handleChange}
              placeholder="Write your post here…"
              rows={14}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Publishing…" : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}