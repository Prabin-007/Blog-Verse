const { Router } = require("express");
const { signup, signin, logout, me } = require("../controllers/authController");
const upload  = require("../middlewares/uploadProfilePic");

const router = Router();

router.post("/signup",upload.single("profileImage") , signup);
router.post("/signin", signin);
router.get("/logout",  logout);
router.get("/me",      me);      // frontend can call this to check login state

module.exports = router;
