// config/query/createTables.js

const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const { hospitals_normalized, hospital_specialties,
  hospital_room_types,
  articles,
  article_summaries,
  articles_categorys,
  specialist,
  medications_reminder,
  tbl_user,
} = require('./schema');

const dbName = process.env.DB_NAME;

// Initial connection to create DB
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL server');

  connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`, (err) => {
    if (err) {
      console.error('❌ Failed to create or verify database:', err);
    } else {
      console.log(`✅ Database '${dbName}' is ready.`);

      const dbConn = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: dbName,
        multipleStatements: true,
      });

      const tableQueries = `
        ${tbl_user}
        ${medications_reminder}
        ${specialist}
        ${hospitals_normalized}
        ${hospital_specialties}
        ${hospital_room_types}
        ${articles_categorys}
        ${articles}
        ${article_summaries}
      `;

      console.log("📄 Executing table creation scripts...");

      dbConn.query(tableQueries, (err) => {
        if (err) {
          console.error('❌ Error creating tables:', err.sqlMessage || err.message);
        } else {
          console.log('✅ All tables are created or verified successfully');
        }
        dbConn.end();
      });
    }
  });
});

// ✅ Use this in your app for queries
const pool = mysqlPromise.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { pool };
