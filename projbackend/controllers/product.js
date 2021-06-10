const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res
        .status(400)
        .json({ error: "Product is Not Available in Database" });
    }
    req.product = product;
    next();
  });
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with Image" });
    }
    // Destructuring all fields

    const { name, description, price, category, stock, sold, feature, offer } =
      fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !stock ||
      !feature ||
      !offer
    ) {
      return res.status(400).json({ error: "All Fields are not filled" });
    }

    let product = new Product(fields);
    console.log(product);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ error: "Photo Size is Too Big" });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    console.log(product);

    product.save((err, product) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Product is Not saved in Database " + err });
      }

      res.json(product);
    });
  });
};

// Geting Products From Databse By ID
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// Geting Only photo of Product From Databse
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// Updating Product from Databse
exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with Image" });
    }

    // Updating Code
    let product = req.product;
    product = _.extend(product, fields);
    // console.log(product);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ error: "Photo Size is Too Big" });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // console.log(product);

    product.save((err, product) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Product is Not saved in Database" });
      }

      res.json(product);
    });
  });
};

// Deleting Product From Database
exports.deleteProduct = (req, res) => {
  let product = req.product;

  product.remove((err, product) => {
    if (err) {
      return res.status(400).json({ error: "Products is not deleting" });
    }
    res.json({ msg: "Product is Successfully Deleted", product });
  });
};

//Listing All Products

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "NO product FOUND",
        });
      }
      res.json(products);
    });
};

// Geting list of categories
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res
        .status(400)
        .json({ msg: "Not Getting all Categories From DB" });
    }
    res.json(category);
  });
};

// Update Stocks and sold field from Product Model
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, product) => {
    if (err) {
      return res.status(400).json({ error: "Bulk Operation Failed" });
    }
    next();
  });
};
