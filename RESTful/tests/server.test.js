// tests/server.test.js
import request from 'supertest';
import express from 'express';
import userRoutes from '../src/routes/userRoutes.js';
import pool from '../src/db.js';

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User API', () => {
    let userId;

    afterAll(async () => {
        if (userId) {
            await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
        }
        await pool.end();
    });

    test('should create a new user', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Test User');
        expect(res.body).toHaveProperty('email', 'testuser@example.com');
        userId = res.body.id;
    });

    test('should fetch all users', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('should fetch a user by ID', async () => {
        const res = await request(app).get(`/users/${userId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', userId);
    });

    test('should update a user', async () => {
        const res = await request(app)
            .put(`/users/${userId}`)
            .send({
                name: 'Updated User',
                email: 'updateduser@example.com',
                password: 'newpassword123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Updated User');
        expect(res.body).toHaveProperty('email', 'updateduser@example.com');
    });

    test('should delete a user', async () => {
        const res = await request(app).delete(`/users/${userId}`);
        expect(res.statusCode).toEqual(204);
    });
});
