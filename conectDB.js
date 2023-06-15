

const mysql = require("mysql");
const fs = require("fs");

require('dotenv').config()

const db = mysql.createConnection({
  host: process.env.SQL_HOST,
  user:process.env.SQL_USERNAME,
  password:process.env.SQL_PASSWORD,
  database: process.env.SQL_DBNAME,
  port:process.env.SQL_PORT,
  ssl:{
    cal: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")
  }
})



module.exports =  db 
