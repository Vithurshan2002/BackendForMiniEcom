const express = require("express");
const { UserRegister, UserLogin, AccessDashboard, Forgotpassword, Resetpassword, UserMessages, Logout } = require("../Controllers/UserRegistrationController");
const { varifyuser } = require("../middlewares/JWTmiddleware");
const { getReviews } = require("../Controllers/UserReviewcontroler");
const router = express.Router();

router.post("/Register", UserRegister);
router.post("/login",UserLogin)
router.post("/forgotpassword",Forgotpassword)
router.post("/resetpassword/:token",Resetpassword)
router.get("/logout",Logout)

// reviews
router.get("/review",getReviews)
//usermesage from home page
router.post("/usermessage",UserMessages)








module.exports = router;
