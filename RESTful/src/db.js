// src/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // sesuaikan dengan user MySQL Anda
    password: '', // sesuaikan dengan password MySQL Anda
    database: 'restful_api_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
