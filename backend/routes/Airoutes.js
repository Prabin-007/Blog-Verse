const { Router } = require("express");
const { requireAuth } = require("../middlewares/authenticate");
const { summarizeBlog, grammarFixBlog } = require("../controllers/Aicontroller");

const router = Router();

router.post("/summarize/:id",   summarizeBlog);              // any user
router.post("/grammar-fix/:id", requireAuth, grammarFixBlog); // owner only

module.exports = router;