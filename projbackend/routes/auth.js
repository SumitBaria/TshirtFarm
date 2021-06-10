const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  signup,
  signin,
  signout,
  isSignedIn,
  isAdmin,
} = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "Name must be more 3 Char Long").isLength({ min: 3 }),
    check("email", "Check your Email Address").isEmail(),
    check("password", "Password Must be 3 Char long").isLength({ min: 3 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "Check your Email Address").isEmail(),
    check("password", "Password is Required").isLength({ min: 1 }),
  ],
  signin
);

router.get("/signout", signout);

// router.post("/testrouter", isSignedIn, (req, res) => {
//   res.send("User is Signed in");
// });

module.exports = router;
