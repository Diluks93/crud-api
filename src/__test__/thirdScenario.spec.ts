import request from 'supertest';

import { server } from '../server';

describe('The third scenario', () => {
  beforeEach((done) => {
    server.close();
    done();
  });

  it(`POST: doesn't create a new post`, async () => {
    const userTest = {
      username: 'test',
      years: 12,
      hobbies: ['test', 'test2'],
    };
    const response = await request(server).post('/api/users').send(userTest);
    expect(response.status).toBe(400);
    expect(JSON.parse(response.text).message).toBe(`Missing required field age`);
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

  it(`PUT: doesn't update a user data`, async () => {
    const users = await request(server).get('/api/users');
    let response = await request(server).put(`/api/users/${users.body[0].id}`).send({
      username: 123,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The username field must be a string');

    response = await request(server)
      .put(`/api/users/${users.body[0].id}`)
      .send({
        username: 'test'.repeat(10),
      });
    expect(response.body.message).toBe('The username field must be less than 32 characters');

    response = await request(server).put(`/api/users/${users.body[0].id}`).send({
      age: '12',
    });
    expect(response.body.message).toBe('The age field must be a number');

    response = await request(server).put(`/api/users/${users.body[0].id}`).send({
      age: 151,
    });
    expect(response.body.message).toBe('The age field must be less than 150');

    response = await request(server).put(`/api/users/${users.body[0].id}`).send({
      hobbies: 'test',
    });
    expect(response.body.message).toBe('The hobby field must be of type array of strings ore empty');

    response = await request(server)
      .put(`/api/users/${users.body[0].id}`)
      .send({
        hobbies: [123],
      });
    expect(response.body.message).toBe('The hobby field must be of type array of strings ore empty');

    response = await request(server).put(`/api/users/${users.body[0].id}`).send({});
    expect(response.body.message).toBeUndefined();

    response = await request(server).put(`/api/users/${users.body[0].id}`).send('{"username": "test",,}');
    expect(response.body.message).toBe('Something went wrong on the server');
  });

  it('Show message "Route not found"', async () => {
    const response = await request(server).get('/some-non/existing/resource');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Route not found`);
  });
});
