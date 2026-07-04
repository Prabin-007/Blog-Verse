const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

const getMyBlogs = async (req, res) => {
  const blogs = await Blog.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  return res.json({ blogs });
};

const getMyComments = async (req, res) => {
  const comments = await Comment.find({ createdBy: req.user._id })
    .populate("blogId", "title")
    .sort({ createdAt: -1 });
  return res.json({ comments });
};

const getLikedBlogs = async (req, res) => {
  const blogs = await Blog.find({ likes: req.user._id })
    .populate("createdBy", "fullName profileImageURL")
    .sort({ createdAt: -1 });
  return res.json({ blogs });
};

const updateMyBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  const isOwner = blog.createdBy.toString() === req.user._id.toString();
  if (!isOwner) return res.status(403).json({ error: "Not authorized" });

  const { title, body } = req.body;
  if (title) blog.title = title;
  if (body) blog.body = body;
  if (req.file) blog.coverImageURL= req.file ? req.file.path : null;

  await blog.save();
  return res.json({ message: "Blog updated", blog });
};

module.exports = { getMyBlogs, getMyComments, getLikedBlogs, updateMyBlog };
