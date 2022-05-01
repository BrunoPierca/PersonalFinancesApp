const Sequelize = require("sequelize");
const database = process.env.DATABASE;
const userMySQL = process.env.USER_MYSQL
const passMySQL = process.env.DB_PASS;
const hostMySQL = process.env.DB_HOST;

const db = new Sequelize(database, userMySQL, passMySQL, {
  host: hostMySQL,
  dialect: "mysql",
  define: {
    timestamps: false,
  },
});

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
