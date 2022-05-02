const express = require("express");
const router = express.Router();
const app = require("../app");
const { Operation, today } = require("../models/Operations");
const jwt = require("jsonwebtoken")
require("dotenv/config"); 


router.get("/" , async (req, res) => {
  const token = req.headers["token"]
  userData = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
  try {
    const userOperations = await Operation.findAll({where : {userID: userData.ID}});
    res.status(200).json({userOperations});
  } catch (error) {
    res.send(error);
  }
});

router.post("/create", async (req, res, next) => {
  const newOperation = req.body.data;
  console.log(typeof newOperation.userID);
  if (newOperation.userID != undefined && newOperation.userID != null) {
    try {
      await Operation.create({
        type: newOperation.type,
        amount: newOperation.amount,
        concept: newOperation.concept,
        date: today,
        category: newOperation.category,
        userID: newOperation.userID,
      });
      let createdOperation = await Operation.findOne({
        where: { userID: newOperation.userID },
        order: [["ID", "DESC"]],
      });
      res.status(200).json({
        message: "new operation created succesfully",
        createdOperation,
      });
    } catch (error) {
      res
        .status(400)
        .json({ error: error, message: "Couldn't create operation" });
    }
  } else {
    res.status(400);
  }
});

router.put("/edit", async (req, res) => {
  const operationInfo = req.body.data;
  try {
    let operation = await Operation.findOne({ where: { ID: operationInfo.ID } });
    operation.set({
      amount: operationInfo.amount,
      concept: operationInfo.concept,
      category: operationInfo.category,
    })
    let newValue = await operation.save()
    res.status(200) .json({
      message: "Operation edited succesfully" ,
      newOperation: newValue
    })
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/delete" , async (req, res) =>{
  const operationID = req.body.data;
  try {
    let operation = await Operation.findOne({ where: { ID: operationID } });
    if (operation != null) {
      await operation.destroy()
      res.status(200).json({
      message: "Operation succesfully deleted"
    })
    } else {
      res.status(400).json({message: "Unable to find operation"})
    }

  } catch (error) {
    res.json({message: error});
  }
})

module.exports = router;
