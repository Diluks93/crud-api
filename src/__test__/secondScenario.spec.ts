import request from 'supertest';

import { server } from '../server';

describe('The second scenario', () => {
  beforeEach((done) => {
    server.close();
    done();
  });

  it(`POST: doesn't create new post`, async () => {
    const userTest = {
      username: 'test',
      age: 12,
      hobbies: ['test', 'test2'],
      email: 'test@example.com',
    };
    const response = await request(server).post('/api/users').send(userTest);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Too many fields');
  });

  it('GET: should return data', async () => {
    const response = await request(server).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });

  it('POST: create a new post', async () => {
    const userTest = {
      username: 'test',
      age: 12,
      hobbies: ['test', 'test2'],
    };
    const response = await request(server).post('/api/users').send(userTest);
    expect(response.status).toBe(201);
  });

  it('GET: should answer with status code 400', async () => {
    const response = await request(server).get(`/api/users/1`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Invalid user id');
  });

  it('GET: should answer with status code 404', async () => {
    const users = await request(server).get('/api/users');
    const id = users.body[0].id.split('-').reverse().join('-');
    const response = await request(server).get(`/api/users/${id}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(`Route not found`);
  });

  it('DELETE: should answer with status code 404', async () => {
    const users = await request(server).get('/api/users');
    const id = users.body[0].id.split('-').reverse().join('-');
    const response = await request(server).delete(`/api/users/${id}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  it('GET: should return data', async () => {
    const response = await request(server).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
  });
});
