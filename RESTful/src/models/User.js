// src/models/User.js
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export const createUser = async (name, email, password) => {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [result] = await pool.execute(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
        [id, name, email, hashedPassword]
    );
    return { id, name, email };
};

export const getUserById = async (id) => {
    const [rows] = await pool.execute('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
};

export const getAllUsers = async () => {
    const [rows] = await pool.execute('SELECT id, name, email, created_at FROM users');
    return rows;
};

export const updateUser = async (id, name, email, password) => {
    let query = 'UPDATE users SET name = ?, email = ?';
    const params = [name, email];
    if (password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        query += ', password = ?';
        params.push(hashedPassword);
    }
    query += ' WHERE id = ?';
    params.push(id);
    await pool.execute(query, params);
    return getUserById(id);
};

export const deleteUser = async (id) => {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
};
