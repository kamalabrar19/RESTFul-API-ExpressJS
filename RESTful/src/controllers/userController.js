// src/controllers/userController.js
import * as User from '../models/User.js';
import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const createUser = async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const user = await User.createUser(value.name, value.email, value.password);
        res.status(201).json(user);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email sudah digunakan.' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body, { presence: 'optional' });
        if (error) return res.status(400).json({ error: error.details[0].message });

        const user = await User.updateUser(req.params.id, value.name, value.email, value.password);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.deleteUser(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
