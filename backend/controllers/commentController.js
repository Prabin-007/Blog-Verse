const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

const addComment = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Comment cannot be empty" });

  const blog = await Blog.findById(req.params.blogId);
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  const comment = await Comment.create({
    content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  const populated = await comment.populate("createdBy", "fullName profileImageURL");
  return res.status(201).json({ message: "Comment added", comment: populated });
};

const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ error: "Comment not found" });

  const isOwner = comment.createdBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Not authorized" });

  await comment.deleteOne();
  return res.json({ message: "Comment deleted" });
};

module.exports = { addComment, deleteComment };
