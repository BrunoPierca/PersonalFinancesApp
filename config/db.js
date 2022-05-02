const Sequelize = require("sequelize");
require("dotenv/config");

// Local connection
// const database = process.env.MYSQLDATABASE;
// const userMySQL = process.env.MYSQLUSER
// const passMySQL = process.env.MYSQLPASSWORD;
// const hostMySQL = process.env.MYSQLHOST;

// const db = new Sequelize(database, userMySQL, passMySQL, {
//   host: hostMySQL,
//   dialect: "mysql",
//   define: {
//     timestamps: false,
//   },
// });

const DB_URI = process.env.DB_URI

const db = new Sequelize(DB_URI) 


async function checkDB() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
checkDB();

module.exports = db;
