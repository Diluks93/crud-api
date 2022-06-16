import { config } from 'dotenv';
import { EOL } from 'os';

import { server } from './src/server';

config();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  process.stdout.write(`Server listening on port ${PORT}` + EOL);
});
