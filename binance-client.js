import WebSocket from 'ws';
import { shyClient } from './client.js';

const ws = new WebSocket(
  'wss://ws.eodhistoricaldata.com/ws/forex?api_token=demo'
);

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('{"action": "subscribe", "symbols": "EURUSD"}');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
  shyClient.send(data);
});
