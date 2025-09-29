const express = require("express");
const { UserRegister, UserLogin, AccessDashboard } = require("../Controllers/UserRegistrationController");
const { varifyuser } = require("../middlewares/JWTmiddleware");
const { getReviews } = require("../Controllers/UserReviewcontroler");
const router = express.Router();

router.post("/Register", UserRegister);
router.post("/login",UserLogin)
/* router.get('/dashboard',varifyuser,AccessDashboard) */


// reviews
router.get("/review",getReviews)


module.exports = router;
