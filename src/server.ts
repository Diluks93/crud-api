import { createServer } from 'http';

import { controller } from './controllers/userController';

const { getUsers, getUser, createUser, updateUser, removeUser } = controller;

const getId = (str: string): string => {
  return str.split('/')[3];
};

const findMatch = (str: string, matcher: RegExp): boolean => {
  return str.match(matcher) !== null;
};

export const server = createServer(async (req, res) => {
  req.on('error', () => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Something went wrong on the server' }));
  });
  res.on('error', () => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Something went wrong on the server' }));
  });

  const ENDPOINT = '/api/users';
  const URL = req.url || '';
  const regex = /\/api\/users\/\d+/;
  const id = getId(URL);

  if (URL === ENDPOINT && req.method === 'GET') {
    getUsers(res);
  } else if (findMatch(URL, regex) && req.method === 'GET') {
    getUser(res, id);
  } else if (URL === ENDPOINT && req.method === 'POST') {
    createUser(req, res);
  } else if (findMatch(URL, regex) && req.method === 'PUT') {
    updateUser(req, res, id);
  } else if (findMatch(URL, regex) && req.method === 'DELETE') {
    removeUser(res, id);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});
