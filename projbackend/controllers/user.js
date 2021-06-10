const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "No User is there is Database",
      });
    }
    req.profile = user;
    // console.log(req.profile);
    next();
  });
};

exports.getUser = (req, res) => {
  // Undefining some fields for the security resons, So that user cant see the fields
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.updatedAt = undefined;
  req.profile.createdAt = undefined;

  return res.json(req.profile);
};

// exports.getAllUser = (req, res) => {
//   User.find().exec((err, user) => {
//     if (err || !user) {
//       return res.status(400).json({
//         err: "No User Found, There is no user in Database",
//       });
//     }

//     res.json(user);
//   });
// };

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update the information." });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.getPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({ error: "No orders in this account" });
      }

      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];

  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};
