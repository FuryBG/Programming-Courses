const authController = require("../controllers/authController");
const productController = require("../controllers/productController");

module.exports = (app) => {
    app.use("/auth", authController);
    app.use("/", productController);
};