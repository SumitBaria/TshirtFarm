const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DataBase" + err.message,
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ err: "User is not Registered" });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({ err: "Passwors is not matching" });
    }

    const token = jwt.sign({ id: user._id }, `${process.env.SECRET}`);

    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, lastname, email, role } = user;

    res.json({
      token,
      user: {
        _id,
        name,
        lastname,
        email,
        role,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout Successfully",
  });
};

// Private Route
exports.isSignedIn = expressJwt({
  secret: `${process.env.SECRET}`,
  userProperty: "auth",
});

// Custom MiddleWares
// Authentication Check
exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth.id;
  // console.log(checker);
  // console.log(req.profile);
  // console.log(req.auth);
  if (!checker) {
    return res
      .status(403)
      .json({ err: "User is Not Authenticated, Access Denied" });
  }

  next();
};

// exports.isAuthenticated = (req, res, next) => {
//   let checker = req.profile && req.auth && req.profile._id == req.auth._id;
//   if (!checker) {
//     return res.status(403).json({
//       error: "ACCESS DENIED"
//     });
//   }
//   next();
// };

// Is Admin Check
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      err: "You are Not Admin, Access Denied",
    });
  }

  next();
};
