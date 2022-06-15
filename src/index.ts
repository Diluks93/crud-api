import { createServer } from 'http';
import { config } from 'dotenv';
import { EOL } from 'os';
import { controller } from './controllers/userController.js';

const { getUsers, getUser } = controller;

const server = createServer((req, res) => {
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

config();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  process.stdout.write(`Server listening on port ${PORT}` + EOL);
});
