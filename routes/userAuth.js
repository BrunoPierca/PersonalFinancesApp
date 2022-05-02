const express = require("express");
const router = express.Router();
const app = require("../app");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const Operation = require("./operations");
const { user } = require("pg/lib/defaults");
require("dotenv/config");

// Encrypt passwords
const saltRounds = parseInt(process.env.SALTROUNDS);

function encryptPass(password) {
  salt = bcrypt.genSaltSync(saltRounds);
  hashedPass = bcrypt.hashSync(password, salt);
  return hashedPass;
}

router.post("/signup", async (req, res, next) => {
  const email = req.body.data.email;
  const password = encryptPass(req.body.data.password);
  // Find if user already exists, if it doesn't, create one
  try {
    let userExists = await User.findOne({ where: { email: email } });
    if (userExists != null) {
      res.status(400).json({
        message: "User already exists",
      });
    } else if (userExists == null) {
      try {
        await User.create({
          email: email,
          password: password,
        }).then((user) => {
          const accessToken = jwt.sign(
            user.dataValues,
            process.env.ACCESS_TOKEN_SECRET
          );

          res.status(200).json({
            message: "User succesfully created",
            accessToken: accessToken,
            userID: user.dataValues.ID,
          });
        });
        next;
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.data.email;
  const password = req.body.data.password;
  let accessToken;
  try {
    let user = await User.findOne({
      where: { email: email },
    });
    accessToken = jwt.sign(user.dataValues, process.env.ACCESS_TOKEN_SECRET);
    let match = await bcrypt.compare(password, user.dataValues.password);
    if (match) {
      res.status(200).json({
        message: "User logged in",
        accessToken: accessToken,
        userID: user.dataValues.ID,
      });
    } else {
      res.status(400).json({
        message: "Password or email doesn't match",
      });
    }
  } catch (error) {
    res.status(400).json({ message: "couldn't find user" , user: user, error: error });
  }
});

module.exports = router;
