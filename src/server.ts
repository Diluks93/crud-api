import { createServer } from 'http';
import { controller } from './controllers/userController';

const { getUsers, getUser } = controller;

export const server = createServer((req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    getUsers(req, res);
  } else if (req.url?.match(/\/api\/users\/\d+/) && req.method === 'GET') {
    const id = req.url?.split('/')[3] as string;
    getUser(req, res, id);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});
