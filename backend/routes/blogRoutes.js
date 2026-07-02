const { Router } = require("express");
const { requireAuth } = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  deleteBlog,
  toggleLike
} = require("../controllers/blogController");

const router = Router();

router.get("/",       getAllBlogs);
router.get("/:id",    requireAuth,getBlogById);
router.post("/",      requireAuth, upload.single("coverImage"), createBlog);
router.delete("/:id", requireAuth, deleteBlog);
router.post("/:id/like",requireAuth,  toggleLike);
module.exports = router;
