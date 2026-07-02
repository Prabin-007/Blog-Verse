const Blog = require("../models/Blog");
const { summarizeText, fixGrammar } = require("../services/geminiService");

// Anyone can summarize any blog
const summarizeBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  const summary = await summarizeText(blog.body);
  return res.json({ summary });
};

// Only the blog owner can run + apply grammar fix
const grammarFixBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy","fullName profileImageURL");
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  const isOwner = blog.createdBy._id.toString() === req.user._id.toString();
  if (!isOwner) return res.status(403).json({ error: "Not authorized" });

  const corrected = await fixGrammar(blog.body);
  blog.body = corrected;
  await blog.save();

  return res.json({ message: "Grammar corrected", blog });
};

module.exports = { summarizeBlog, grammarFixBlog };