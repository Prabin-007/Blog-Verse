const { Router } = require("express");
const { requireAuth } = require("../middlewares/authenticate");
const { addComment, deleteComment } = require("../controllers/commentController");

const router = Router();

router.post("/:blogId",  requireAuth, addComment);
router.delete("/:id",    requireAuth, deleteComment);

module.exports = router;
