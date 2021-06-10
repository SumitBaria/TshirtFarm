const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// My Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");

const app = express();

// Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

//Database Port Address
const url = process.env.MONGODB_URI || "mongodb://localhost/tshirtStore";

//Server Port
const port = process.env.PORT || 3001;

// Database Connection
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const con = mongoose.connection;

con.on("open", () => {
  console.log("DataBase is Connected SuccessFully!!!");
});

//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

//Server Running
app.listen(port, (req, res) => {
  console.log(`Server is Up on ${port}`);
});
