const express = require("express");
const router = express.Router();

// On ajoute un prefix aux routes qu'on recupere via le require
router.use("/department", require("./department"));
router.use("/category", require("./category"));
router.use("/product", require("./product"));

module.exports = router;
