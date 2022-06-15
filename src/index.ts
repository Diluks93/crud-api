import { createServer } from 'http';
import { config } from 'dotenv';

const message = 'Hello World!';
config();
createServer(function (request, response) {
  console.log(message);
  response.end(message);
}).listen(process.env.PORT, () => {
  console.log('Сервер начал прослушивание порта ' + process.env.PORT);
});
