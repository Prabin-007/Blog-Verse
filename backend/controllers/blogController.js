const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({})
    .populate("createdBy", "fullName profileImageURL")
    .sort({ createdAt: -1 });
  return res.json({ blogs });
};

const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate(
    "createdBy",
    "fullName profileImageURL"
  );
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  const comments = await Comment.find({ blogId: req.params.id })
    .populate("createdBy", "fullName profileImageURL")
    .sort({ createdAt: -1 });

  return res.json({ blog, comments });
};

const createBlog = async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body)
    return res.status(400).json({ error: "Title and body are required" });

  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: req.file ? `/uploads/${req.file.filename}` : null,
  });
  return res.status(201).json({ message: "Blog created", blog });
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  // Only the author or an admin can delete
  const isOwner = blog.createdBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Not authorized" });

  await blog.deleteOne();
  //  delete comments of that blog
  await Comment.deleteMany({ blogId: req.params.id });

  return res.json({ message: "Blog deleted" });
};

// Toggle like/unlike on a blog for the logged-in user
const toggleLike = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  const userId = req.user._id.toString();
  const alreadyLiked = blog.likes.some((id) => id.toString() === userId);

  if (alreadyLiked) {
    blog.likes = blog.likes.filter((id) => id.toString() !== userId);
  } else {
    blog.likes.push(req.user._id);
  }

  await blog.save();
  return res.json({ liked: !alreadyLiked, likesCount: blog.likes.length });
};

module.exports = { getAllBlogs, getBlogById, createBlog, deleteBlog, toggleLike };
