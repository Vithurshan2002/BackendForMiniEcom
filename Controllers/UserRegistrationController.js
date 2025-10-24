const userDetailmodel = require("../models/UserInforation");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const userContactsmodel = require("../models/ContactMembers");
const bcrypt = require("bcrypt");
//register the student

//i ue nodemaier for login and reset puposes..so insted of wrte twice i write in common place
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Registration Successful",
      html: "<!DOCTYPE html><html><body><h2>Registration Successful!</h2><p>Welcome to BitZa, your account has been created successfully.</p><a href='http://localhost:5173/'>Go to Login</a></body></html>",
    };

    // Promise-based email sending
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Successfully Registered. Please check your email.",
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
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

//Forgotpassword
exports.Forgotpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (email) {
      const user = await userDetailmodel.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "Email is not Exist" });
      }

      const tokens = jwt.sign({ email: email }, process.env.NEW_SECREAT_KEY, {
        expiresIn: "5m",
      });
      let mailOptions = {
        from: process.env.USER,
        to: email,
        subject: "Forgotpassword",
        text: `https://bitza-ecom.vercel.app/resetPassword/${tokens}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(400).json({ message: error.message });
        } else {
          return res.status(200).json({ message: "Email Sent" });
        }
      });
    } else {
      res.status(404).json({
        message: "Enter the Email",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
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
