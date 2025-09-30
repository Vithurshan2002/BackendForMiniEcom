const userDetailmodel = require("../models/UserInforation");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
//register the student

//i ue nodemaier for login and reset puposes..so insted of wrte twice i write in common place
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.pass,
  },
});

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

        //send to email to the user
        let mailOptions = {
          from: process.env.USER,
          to: email,
          subject: "Registration",
          html: "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>BitZa - Registration Success</title><style>body{margin:0;height:100vh;display:flex;justify-content:center;align-items:center;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80') no-repeat center center/cover;color:#fff}.card{background:rgba(0,0,0,0.55);border-radius:20px;padding:40px;width:90%;max-width:420px;text-align:center;backdrop-filter:blur(6px);box-shadow:0 8px 32px rgba(0,0,0,.4);animation:fadeInUp 1s ease}.icon{font-size:60px;color:#4ade80;margin-bottom:20px;animation:pop .6s ease}h1{font-size:2rem;margin-bottom:10px;font-weight:700}p{font-size:1rem;margin-bottom:25px;color:#e0e0e0}.btn{display:inline-block;padding:12px 25px;font-size:1rem;border-radius:30px;background:#4ade80;color:#111;font-weight:bold;text-decoration:none;transition:all .3s}.btn:hover{background:#22c55e;transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.3)}@keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}@keyframes pop{0%{transform:scale(.5);opacity:0}100%{transform:scale(1);opacity:1}}</style></head><body><div class='card'><div class='icon'>✅</div><h1>Registration Successful!</h1><p>Thank you for registering with <strong>BitZa</strong>. Your account has been created successfully.</p><a href='http://localhost:5173/' class='btn'>Go to Login</a></div></body></html>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return res.status(400).json({ message: error.message });
          } else {
            return res.status(200).json({ message: "Email Sent" });
          }
        });
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
    res.status(400).json({
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
            expiresIn: "10m",
          });
          const Refreshtoken = jwt.sign(
            { email: email },
            process.env.SECREAT_KEY_Refresh,
            { expiresIn: "30m" }
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

          res.status(200).json({ message:user});
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

      const tokens = jwt.sign({ email: email }, process.env.new_Secreat_key, {
        expiresIn: "1m",
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
