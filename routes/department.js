const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  const title = req.body.title;
  // On checher un boutique dans la base de donnee qui a comme nom `title`
  const ifExist = await Department.findOne({ title: title });
  if (ifExist !== null) {
    return res.status(400).send({
      error: {
        message: "Department already exists"
      }
    });
  }
  // On genere le nouveau department
  try {
    // On cree un nouveau department avec le Model
    const newDepartment = Department({
      title: title
    });

    // On sauvegarde le nouveau medoc pour l'ajouter a la base de donnee
    await newDepartment.save();
    res.status(201).send(newDepartment);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  const id = req.query.id;
  const title = req.body.title;

  try {
    // On checher un boutique dans la base de donnee qui a comme nom `title`
    const departmentToRename = await Department.findById({ _id: id });
    // Si on en trouve un ERROR
    departmentToRename.title = title;
    await departmentToRename.save();
    res.status(201).send(departmentToRename);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const id = req.query.id;

    const departement = await Departement.find().populate({
      path: "departement"
    });
    for (let i = 0; i < departement.length; i++) {
      if (departement[i]._id.toString() === id.toString()) {
        // console.log("delete Departement");
        /* ............................................................. */
        const category = await Category.find().populate({
          path: "departement"
        });
        for (let j = 0; j < category.length; j++) {
          if (category[j].departement._id.toString() === id.toString()) {
            // console.log("delete Category");
            /* ............................................................. */
            const product = await Product.find().populate({ path: "category" });
            for (let k = 0; k < product.length; k++) {
              if (
                product[k].category.departement.toString() === id.toString()
              ) {
                // console.log("delete Product");
                await product[k].remove();
              }
            }
            /* ............................................................. */
            await category[j].remove();
          }
        }
        /* ............................................................. */
        await departement[i].remove();
      }
    }
    res.json({ message: "delete OK" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
