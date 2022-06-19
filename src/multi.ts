import cluster from 'node:cluster';
import os from 'node:os';

import { server } from './server';

const PORT = process.env.PORT || 3000;
const pid = process.pid;

if (cluster.isPrimary) {
  const count = os.cpus().length;
  process.stdout.write(`Primary pid: ${pid}${os.EOL}`);
  process.stdout.write(`Starting ${count} workers${os.EOL}`);
  for (let i = 0; i < count; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      process.stdout.write(`Worker ${worker.id} crashed. Starting a new worker...${os.EOL}`);
      cluster.fork();
    }
  });
} else {
  const id = cluster.worker?.id;
  process.stdout.write(`Worker: ${id}, pid: ${pid}, port: ${PORT}${os.EOL}`);
  server.listen(PORT, () => {
    process.stdout.write(`Started process ${pid}${os.EOL}`);
  });
}
