import request from 'supertest';

import { server } from '../server';

describe('The first scenario', () => {
  beforeEach((done) => {
    server.close();
    done();
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
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.user).toMatchObject(userTest);
  });

  it('GET: should return data by id', async () => {
    const users = await request(server).get('/api/users');
    const response = await request(server).get(`/api/users/${users.body[0].id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('age');
    expect(response.body).toHaveProperty('hobbies');
  });

  it('PUT: update a user data', async () => {
    const users = await request(server).get('/api/users');
    const response = await request(server).put(`/api/users/${users.body[0].id}`).send({
      username: 'test2',
    });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('test2');
  });

  let id = '';
  it('DELETE: delete a user', async () => {
    const users = await request(server).get('/api/users');
    id = users.body[0].id;
    const response = await request(server).delete(`/api/users/${id}`);
    expect(response.status).toBe(204);
  });

  it('GET: should return data by id', async () => {
    const response = await request(server).get(`/api/users/${id}`);
    expect(response.status).toBe(404);
    expect(JSON.parse(response.text).message).toBe(`User doesn't exist`);
  });
});
