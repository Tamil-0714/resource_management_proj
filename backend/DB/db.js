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
async function fetchReqInfo(stdId) {
  try {
    const query = `select * from stdRequestInfo where id = ? and reqStatus ='pending'`;
    const params = [stdId];
    const rows = await queryDB(query, params);
    return rows;
  } catch (error) {
    console.error(error);
  }
}
async function addNewStd(stdName, stdId, stdPass) {
  try {
    const query = `insert into studentCred values(?,?)`;
    const params = [stdId, stdPass];
    const rows = await queryDB(query, params);
    if (rows?.affectedRows === 1) {
      const query = "insert into studentProfile(id,stdName) values(?,?)";
      const param = [stdId, stdName];
      const rows = await queryDB(query, param);
      return rows;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
}

// addNewStd("ok", "22abc123", "123");

module.exports = {
  fetchCred,
  fetchStsInfo,
  fetchReqInfo,
  addNewStd,
};
