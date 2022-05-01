const Sequelize = require("sequelize");
const app = require("../app");
const db = require("../config/db.js");
// Date
let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
let yyyy = today.getFullYear();
today = mm + "/" + dd + "/" + yyyy;

const Operation = db.define("finances", {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  concept: { type: Sequelize.TEXT },
  type: { type: Sequelize.TEXT },
  amount: { type: Sequelize.INTEGER },
  date: { type: Sequelize.DATE },
  category: { type: Sequelize.TEXT },
  userID: { type: Sequelize.INTEGER },
});

module.exports = { Operation, today };
