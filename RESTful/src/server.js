// src/server.js
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Swagger Setup
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'RESTful API',
            version: '1.0.0',
            description: 'API documentation for the RESTful API project',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the RESTful API');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
