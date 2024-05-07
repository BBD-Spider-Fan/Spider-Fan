const express = require('express');
const { join } = require('path');

const app = express();

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.sendFile(join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/report', (request, response) => {
  response.sendFile(join(__dirname, 'public', 'pages', 'report.html'));
});

app.get('/auth', (request, response) => {
  response.sendFile(join(__dirname, 'public', 'pages', 'auth.html'));
});

app.get('/history', (request, response) => {
  response.sendFile(join(__dirname, 'public', 'pages', 'history.html'));
});

app.listen(3001, () => {
  console.log('Client active on port 3001!');
})