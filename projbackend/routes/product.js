const express = require("express");
const router = express.Router();

// geting Controllers
const {
  getProductById,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  photo,
  getAllProducts,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// Geting Id param From Controllers
router.param("productId", getProductById);
router.param("userId", getUserById);

// Creating Products:
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//Getting Products
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//Update Products
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// Delete Product
router.get(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

// List All Products
router.get("/products", getAllProducts);

module.exports = router;
