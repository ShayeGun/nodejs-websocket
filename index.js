import express from 'express';

const app = express();

app.use('*', (req, res) => {
  res.send('you are connected to HTTP server on port 3000');
});

app.listen(3000, console.log('connected to http server'));
