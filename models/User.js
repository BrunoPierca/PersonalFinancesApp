const Sequelize = require("sequelize");
const app = require("../app");
const db = require("../config/db.js");

const User = db.define("users", {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: { type: Sequelize.TEXT },
  password: { type: Sequelize.TEXT },
});

async function test() {
  try {
    await User.create({
      email: "maximovirgolini@gmail.cum",
      password: "uwus",
    });
    console.log("User created");
  } catch (error) {
    console.log(error);
  }
}
// test();

module.exports = User;
