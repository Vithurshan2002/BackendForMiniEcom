const express = require("express");
const { UserRegister, UserLogin, AccessDashboard, Forgotpassword, Resetpassword } = require("../Controllers/UserRegistrationController");
const { varifyuser } = require("../middlewares/JWTmiddleware");
const { getReviews } = require("../Controllers/UserReviewcontroler");
const router = express.Router();

router.post("/Register", UserRegister);
router.post("/login",UserLogin)
router.post("/forgotpassword",Forgotpassword)
router.post("/resetpassword/:token",Resetpassword)
/* router.get('/dashboard',varifyuser,AccessDashboard) */


// reviews
router.get("/review",getReviews)


module.exports = router;
