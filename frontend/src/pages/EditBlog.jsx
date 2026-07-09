import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/axios";

import "./AddBlog.css";

export default function EditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", body: "" });
  const [coverImage, setCoverImage] = useState(null);
  const [existingCover, setExistingCover] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/blogs/${id}`)
      .then((res) => {
        setForm({ title: res.data.blog.title, body: res.data.blog.body });
        setExistingCover(res.data.blog.coverImageURL);
      })
      .catch(() => setError("Failed to load blog."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("body", form.body);
      if (coverImage) fd.append("coverImage", coverImage);

      await api.put(`/users/me/blogs/${id}`, fd);
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="page">
      <Navbar />
      <div className="loader-wrap"><div className="loader" /></div>
    </div>
  );

  return (
    <div className="page">
      <Navbar />
      <div className="addblog-wrap">
        <h2 className="addblog-title">Edit post</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="addblog-form">
          <div className="field">
            <label htmlFor="coverImage">Cover Image</label>
            {existingCover && !coverImage && (
              <img src={existingCover} alt="current cover" className="edit-current-cover" />
            )}
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="file-input"
            />
            {coverImage && <span className="file-name">{coverImage.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
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
              rows={14}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}