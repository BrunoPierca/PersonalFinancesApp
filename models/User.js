const Sequelize = require("sequelize");
const app = require("../app");
const db = require("../config/db.js");

// async function initiateUser() {
  
// }

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
async function checkTable() {
  await User.sync();
}
checkTable()

module.exports = User;
