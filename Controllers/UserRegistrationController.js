const userDetailmodel = require("../models/UserInforation");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const userContactsmodel = require("../models/ContactMembers");
const bcrypt = require("bcrypt");
//register the student

exports.UserRegister = async (req, res, next) => {
  const { Firstname, Lastname, email, password } = req.body;

  try {
    if (!Firstname || !Lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (Firstname, Lastname, email, password) are required.",
      });
    }

    const existingUser = await userDetailmodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `${email} already exists.`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userDetailmodel.create({
      Firstname,
      Lastname,
      email,
      password: hashedPassword,
    });

    const emaildata = {
      sender: { name: "Bitza", email: process.env.EMAIL },
      to: [{ email: email }],
      subject: "Registration Successful",
      htmlContent:
        "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>BitZa - Registration Success</title><style>body{margin:0;height:100vh;display:flex;justify-content:center;align-items:center;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80') no-repeat center center/cover;color:#fff}.card{background:rgba(0,0,0,0.55);border-radius:20px;padding:40px;width:90%;max-width:420px;text-align:center;backdrop-filter:blur(6px);box-shadow:0 8px 32px rgba(0,0,0,.4);animation:fadeInUp 1s ease}.icon{font-size:60px;color:#4ade80;margin-bottom:20px;animation:pop .6s ease}h1{font-size:2rem;margin-bottom:10px;font-weight:700}p{font-size:1rem;margin-bottom:25px;color:#e0e0e0}.btn{display:inline-block;padding:12px 25px;font-size:1rem;border-radius:30px;background:#4ade80;color:#111;font-weight:bold;text-decoration:none;transition:all .3s}.btn:hover{background:#22c55e;transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.3)}@keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}@keyframes pop{0%{transform:scale(.5);opacity:0}100%{transform:scale(1);opacity:1}}</style></head><body><div class='card'><div class='icon'>✅</div><h1>Registration Successful!</h1><p>Thank you for registering with <strong>BitZa</strong>. Your account has been created successfully.</p><a href='https://bitza-ecom.vercel.app' class='btn'>Go to Login</a></div></body></html>",
    };
    const emailresponse = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      emaildata,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.APIKEY,
        },
      }
    );

    // Respond to client
    return res.status(200).json({
      success: true,
      message: "Successfully Registered. Please check your email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Registration failed: ${error.message}`,
    });
  }
};

//userLogin

exports.UserLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const user = await userDetailmodel.findOne({ email: email });
      if (!user) {
        res.status(500).json({ message: "Email is Invalid" });
      } else {
        const pass = user.password;
        const result = await bcrypt.compare(password, pass);
        if (result) {
          const token = jwt.sign({ email: email }, process.env.SECREAT_KEY, {
            expiresIn: "10m",
          });
          const Refreshtoken = jwt.sign(
            { email: email },
            process.env.SECREAT_KEY_REFRESH,
            { expiresIn: "30m" }
          );

          res.cookie("Token", token, {
            maxAge: 10 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          res.cookie("RefreshToken", Refreshtoken, {
            maxAge: 30 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });

          res.status(200).json({ message: user });
        } else {
          res.status(400).json({ message: "Password Invalid" });
        }
      }
    } else {
      res.status(400).json({ message: "Inavlid Credintials" });
    }
  } catch (error) {
    res.status(400).json({ message: "Unsuccessffull Loggedin " });
  }
};

exports.Forgotpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Enter the Email" });
    }

    const user = await userDetailmodel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    const token = jwt.sign({ email: email }, process.env.NEW_SECREAT_KEY, {
      expiresIn: "5m",
    });

    const emailData = {
      sender: { name: "Bitza", email: process.env.EMAIL },
      to: [{ email: email }],
      subject: "Forgot Password",
      htmlContent: `<p>Click the link to reset your password:
                    <a href="https://bitza-ecom.vercel.app/resetPassword/${token}"><u>Reset Password<u/></a></p>`
    };

    const emailResponse = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      emailData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.APIKEY,
        },
      }
    );

    if (emailResponse.status === 201) {
      return res.status(200).json({ message: "Email Sent Successfully" });
    } else {
      return res.status(500).json({ message: "Failed to send email" });
    }

  } catch (error) {
    console.error("Forgotpassword Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//reset password

exports.Resetpassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decodedata = jwt.verify(token, process.env.NEW_SECREAT_KEY);

    const salt = await bcrypt.genSalt(10);
    const encreptedpassword = await bcrypt.hash(password, salt);

    const user = await userDetailmodel.findOneAndUpdate(
      { email: decodedata.email },
      { password: encreptedpassword },
      { new: true }
    );
    if (user) {
      res.status(200).json({ message: "succesfully Password Reset " });
    } else {
      return res.status(400).json({ message: "Unauthorized Access" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//logout
exports.Logout = (req, res, next) => {
  res.clearCookie("Token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("RefreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

//user messages
exports.UserMessages = async (req, res, next) => {
  const { fullname, email, contact, message } = req.body;
  try {
    if (fullname && email && contact && message) {
      const userdata = await userContactsmodel.create({
        fullname: fullname,
        email: email,
        contactno: contact,
        message: message,
      });
      if (userdata) {
        return res
          .status(200)
          .json({ success: true, message: "Successfully Sent." });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "message Not  Sent." });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Enter the full details" });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Message Not end :${error.message}`,
    });
  }
};
