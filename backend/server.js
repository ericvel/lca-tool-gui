const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 8000;
const table ='buildings';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
});

app.listen(port, () => {
  console.log(`⚡ Express server now listening on port ${port}`);
});

app.get('/api/:table', (req, res) => {
  const query = `select * from ${req.params.table} limit ${req.query.skip}, ${req.query.take}`;
  console.log("Query: " + query)
  pool.query(query, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

app.get('/api/count/:table', (req, res) => {
  const query = `select count(*) from ${req.params.table}`;
  console.log("Query: " + query)
  pool.query(query, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});