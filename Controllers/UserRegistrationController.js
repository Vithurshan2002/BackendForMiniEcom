const userDetailmodel = require("../models/UserInforation");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
//register the student
exports.UserRegister = async (req, res, next) => {
  const { Firstname, Lastname, email, password } = req.body;
  try {
    if (Firstname && Lastname && email && password) {
      const user = await userDetailmodel.findOne({ email: email });
      if (!user) {
        const userdata = await userDetailmodel.create({
          Firstname: Firstname,
          Lastname: Lastname,
          email: email,
          password: password,
        });
        console.log(userdata);
        res
          .status(200)
          .json({ success: true, message: "Successfully Registered." });
      } else {
        res.status(400).json({
          success: false,
          message: `${email} is alreay Exist.`,
        });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Some Informations is not provided" });
    }
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: `Unsuccessfull Registration :${error.message}`,
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
        if (pass === password) {
          const token = jwt.sign({ email: email }, process.env.SECREAT_KEY, {
            expiresIn: "1m",
          });
          const Refreshtoken = jwt.sign(
            { email: email },
            process.env.SECREAT_KEY_Refresh,
            { expiresIn: "5m" }
          );

          res.cookie("Token", token, {
            maxAge: 60000,
            httpOnly: true,
            secure: true,
          });
          res.cookie("RefreshToken", Refreshtoken, {
            maxAge: 300000,
            httpOnly: true,
            secure: true,
          });

          res.status(200).json({ message: "Successfuly LoggedIn" });
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

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.pass,
        },
      });

      const tokens = jwt.sign({ email: email }, process.env.new_Secreat_key, {
        expiresIn: "4m",
      });
      let mailOptions = {
        from: process.env.USER,
        to: email,
        subject: "Forgotpassword",
        text: `http://localhost:5173/resetPassword/${tokens}`,
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
    const decodedata = jwt.verify(token, process.env.new_Secreat_key);


    const user = await userDetailmodel.findOneAndUpdate(
      { email: decodedata.email },
      { password: password },
      {new: true}
    );
    if (user) {
       res.status(200).json({ message: "succesfully Password Reset " });
    }
    else{
       return res.status(400).json({ message:"Unauthorized Access" });
    }

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
