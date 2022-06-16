import { createServer } from 'http';
import { controller } from './controllers/userController';

const { getUsers, getUser, createUser } = controller;

export const server = createServer(async (req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    getUsers(req, res);
  } else if (req.url?.match(/\/api\/users\/\d+/) && req.method === 'GET') {
    const id = req.url?.split('/')[3] as string;
    getUser(req, res, id);
  } else if (req.url === '/api/users' && req.method === 'POST') {
    createUser(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});
