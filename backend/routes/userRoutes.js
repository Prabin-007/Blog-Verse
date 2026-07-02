const { Router } = require("express");
const { requireAuth } = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");
const {
  getMyBlogs,
  getMyComments,
  getLikedBlogs,
  updateMyBlog,
} = require("../controllers/userController");

const router = Router();

router.get("/me/blogs",      requireAuth, getMyBlogs);
router.get("/me/comments",   requireAuth, getMyComments);
router.get("/me/liked",      requireAuth, getLikedBlogs);
router.put("/me/blogs/:id",  requireAuth, upload.single("coverImage"), updateMyBlog);

module.exports = router;
