const mysql = require("mysql2");
const { param } = require("../routes/loginRoute");

function connectDB() {
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "TooJoo_1967",
    database: "resource_mangement",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  return pool.promise();
}

async function queryDB(sql, params) {
  try {
    const connection = await connectDB();
    const [rows] = await connection.query(sql, params);
    connection.releaseConnection();
    return rows;
  } catch (error) {
    throw error;
  }
}

async function fetchCred(id, flag) {
  try {
    let query;
    // console.log("this is flag db", flag);

    switch (flag) {
      case "admin":
        query = "SELECT * FROM adminCred WHERE id = ?";
        break;
      case "faculty":
        query = "SELECT * FROM facultyCred WHERE id = ?";
        break;
      case "student":
        query = "SELECT * FROM studentCred WHERE id = ?";
        break;
    }
    const params = [id];
    const rows = await queryDB(query, params);
    console.log("this is rows : ", rows);

    return rows;
  } catch (error) {
    console.error(error);
    // throw error;
  }
}

async function fetchStsInfo() {
  try {
    const query = `select * from studentProfile where id in (select id from stdRequestInfo)`;
    const params = [];
    const rows = await queryDB(query, params);
    return rows;
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  fetchCred,
  fetchStsInfo,
};
