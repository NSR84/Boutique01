const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categorys = await Category.find().populate(department);
    res.json(categorys);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const department = req.body.department;
  // On checher une category dans la base de donnee qui a comme nom `title`
  const ifExist = await Category.findOne({ title: title });
  if (ifExist !== null) {
    return res.status(400).send({
      error: {
        message: "Category already exists"
      }
    });
  }
  try {
    // On cree un nouveau category avec le Model
    const newCategory = Category({
      title: title,
      description: description,
      department: department
    });

    // On sauvegarde le nouveau category pour l'ajouter a la base de donnee
    await newCategory.save();
    res.status(201).send(newCategory);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  const id = req.query.id;
  const title = req.body.title;
  const description = req.body.description;
  const department = req.body.department;

  try {
    // On checher  dans la base de donnee qui a comme nom `title`
    const categoryToRename = await Category.findOne({ _id: id });
    // Si on en trouve un ERROR
    if (title !== null) {
      categoryToRename.title = title;
    }
    if (description !== null) {
      categoryToRename.description = description;
    }
    await categoryToRename.save();
    res.status(201).send(categoryToRename);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const id = req.query.id;
    /* ............................................................. */
    const category = await Category.find().populate({ path: "departement" });
    for (let j = 0; j < category.length; j++) {
      if (category[j].departement._id.toString() === id.toString()) {
        // console.log("delete Category");
        /* ............................................................. */
        const product = await Product.find().populate({ path: "category" });
        for (let k = 0; k < product.length; k++) {
          if (product[k].category.departement.toString() === id.toString()) {
            // console.log("delete Product");
            await product[k].remove();
          }
        }
        /* ............................................................. */
        await category[j].remove();
      }
    }
    res.json({ message: "delete OK" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
