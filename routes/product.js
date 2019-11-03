const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const category = req.query.category;
    const priceMin = req.query.priceMin;
    const priceMax = req.query.priceMax;
    const title = req.query.title;
    const products = Product.find().populate("category");
  
    try {
      if (title !== null) {
        products = Product.find({ title: title });
      }
  
      if (
        (category !== null && priceMin === null) ||
        (category !== null && priceMax === null)
      ) {
        products = await Product.findById(category);
      }
  
      if (priceMin !== null) {
        products = await Product.find().gt("price", priceMin); // >= priceMin
        // products = await Product.find('price': { $gte: >= priceMin });
        if (category !== null) {
          products = await Product.findById(category).gt("price", priceMin); // >= priceMin
        }
      }
  
      if (priceMax !== null) {
        products = await Product.find().lt("price", priceMax); // <= priceMax
        // products = await Product.find(price: { $gte: <= priceMax });
        if (category !== null) {
          products = await Product.findById(category).lt("price", priceMax); // <= priceMax
        }
      }
  
      if (req.query.sort === "price-asc") {
        products = await products.sort({ price: 1 });
      }
  
      if (req.query.sort === "price-desc") {
        products = await products.sort({ price: -1 });
      }
  
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

router.post("/create", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = Number(req.body.price);
    const category = req.body.category;
  
    // On cheche un produit dans la base de donnee qui a comme nom `title`
    const ifExist = await Product.findOne({ title: title });
    if (ifExist !== null) {
      return res.status(400).send({
        error: {
          message: "Product already exists"
        }
      });
    }
    try {
      // On cree un nouveau product avec le Model
      const newProduct = Product({
        title: title,
        description: description,
        price: price,
        category: category
      });
  
      // On sauvegarde le nouveau product pour l'ajouter a la base de donnee
      await newProduct.save();
      res.status(201).send(newProduct);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
});

router.put("/update", (req, res) => {
    const id = req.query.id;
    const title = req.body.title;
    const description = req.body.description;
    const price = Number(req.body.price);
    const category = req.body.category;
  
    try {
      const product = await Product.findById(id);
      if (title !== null) {
        product.title = title;
      }
      if (description !== null) {
        product.description = description;
      }
      if (price !== null) {
        product.price = price;
      }
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
});

router.delete("/delete", (req, res) => {
    const id = req.body.id;
    try {
      await Product.findByIdAndRemove(id);
      res.send("Product deleted");
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
});

module.exports = router;
