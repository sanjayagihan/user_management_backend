const request = require('supertest');
const app = require('./server');
const jwt = require('jsonwebtoken');

const generateAuthToken = () => {
    return jwt.sign({ username: 'haulmatic' }, 'secretKey', { expiresIn: '1h' });
};

describe('User Management API Tests', () => {
    let token;

    beforeAll(() => {
        token = generateAuthToken();
    });

    it('should create a new user successfully', async () => {
        const newUser = { firstName: 'John', lastName: 'Doe' };

        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.firstName).toBe(newUser.firstName);
        expect(response.body.lastName).toBe(newUser.lastName);
    });

    it('should fail to create a user with missing fields', async () => {
        const invalidUser = { firstName: 'Jane' };

        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(invalidUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid data');
    });

    it('should update an existing user successfully', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'Alice', lastName: 'Smith' });

        const userId = createResponse.body.id;

        const updatedUser = { firstName: 'Alice', lastName: 'Johnson' };
        const updateResponse = await request(app)
            .put(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUser);

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.firstName).toBe(updatedUser.firstName);
        expect(updateResponse.body.lastName).toBe(updatedUser.lastName);
    });

    it('should fail to update a user with an invalid ID', async () => {
        const invalidId = 9999;
        const updatedUser = { firstName: 'Bob', lastName: 'Brown' };

        const response = await request(app)
            .put(`/users/${invalidId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUser);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });
});
