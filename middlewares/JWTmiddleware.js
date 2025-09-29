const jwt = require("jsonwebtoken");

 const Renewtoken = (req, res,next) => {
  const refreshToken = req.cookies.RefreshToken;
  if (refreshToken) {
    jwt.verify(
      refreshToken,
      process.env.SECREAT_KEY_Refresh,
      (error, decodedata) => {
        if (error) {
          return res.json({ valid:false});
        } else {
          const token = jwt.sign({ email: decodedata.email }, process.env.SECREAT_KEY, {
            expiresIn: "1m",
          });

          res.cookie("Token", token, {
            maxAge: 60000,
            httpOnly: true
          });

          req.emailu = decodedata.email;
          return next();

        }
      }
    ); 
  } else {
    return res.json({
      valid: false,
      message: "Refresh token expired so i  cant genere new token",
    });
  }
};
 

exports.varifyuser = (req, res, next) => {
  const accesstoken = req.cookies.Token;
  if (accesstoken) { 
    jwt.verify(accesstoken, process.env.SECREAT_KEY, (error, decodedata) => {
      if (error) {
        return res.json({ valid: false });
      } else {
        req.emailu = decodedata.email;
        next();
      }
    });
  } else {
    Renewtoken(req,res,next);
  }
};
