const Category = require("../models/category");

//Geting Id and category from database and storing it on req.category
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err || !cate) {
      return res.status(400).json({
        error: "No Category is there is Database",
      });
    }
    req.category = cate;
    next();
  });
};

//Geting Category from database by Id
exports.getCategory = (req, res) => {
  return res.json(req.category);
};

//Geting all Category from the server
exports.getAllCategory = (req, res) => {
  Category.find().exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "No Category is there is Database",
      });
    }

    res.json(category);
  });
};

//Creating category
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category is Not saved in Database" + err,
      });
    }

    res.json(category);
  });
};

// Updating Category
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category is Not Updated in Database" + err,
      });
    }

    res.json(category);
  });
};

//removing Category From Database
exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Category is Not Removed in Database",
      });
    }

    res.json({ msg: "Category is Successfully Removed", category });
  });
};
