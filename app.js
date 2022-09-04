const express = require('express');
const app = express();
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const multer = require('multer');

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module







const defaultPort = 8800;
app.use(express.static('public'));
const PORT = process.env.PORT || defaultPort;
app.listen(PORT);