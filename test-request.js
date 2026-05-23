import http from 'http';
const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/define',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', body));
});
req.write(JSON.stringify({ term: "Heart Attack" }));
req.end();
