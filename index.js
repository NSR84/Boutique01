const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/product-catalog", {
  useNewUrlParser: true
});

// On recupere le router du fichier ./routes/index.js
const routes = require("./routes");

// On l'utilise
app.use(routes);

app.listen(3000, () => {
  console.log("Server started");
});
