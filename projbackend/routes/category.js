const express = require("express");
const router = express.Router();

//geting Controllers
const { getUserById } = require("../controllers/user");
const {
  getCategoryById,
  getCategory,
  getAllCategory,
  createCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/category");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

//Geting Id params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Getting Categories
router.get("/category/:categoryId", getCategory);
router.get(
  "/category",

  getAllCategory
);

//Creating Categories
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

//Updating Categories
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//removeCategories
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
