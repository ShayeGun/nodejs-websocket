import { WebSocketServer } from 'ws';
import express from 'express';
import { systemInfo, broadcast } from './controllers/index.js';
import { routes } from './routes/index.js';
let counter = 0;

const app = express();
const PORT = process.env.PORT || 3001;
const wss = new WebSocketServer({ noServer: true });
const wssBroad = new WebSocketServer({ noServer: true });

wss.on('connection', function connection(ws, req) {
  ws.on('error', console.error);

  ws.on('message', systemInfo(ws));

  ws.on('test', function (t) {
    console.log(t);
    console.log(this);
  });

  ws.send(`you are connected to Shynance test ${counter++}`);
});

wssBroad.on('connection', function connection(ws, req) {
  ws.on('message', broadcast(wssBroad, ws));

  ws.send('you are connected to Shynance');
});

const server = app.listen(PORT, () => {
  console.log(`server is up on port ${PORT} ...`);
});

const routesTable = {
  '/ws': wss,
  '/broadcast': wssBroad,
};

server.on('upgrade', routes(routesTable));
