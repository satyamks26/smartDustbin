import http from 'http';

console.log("Sending request...");
http.get('http://localhost:3000', (res) => {
    console.log('Response received! Status:', res.statusCode);
    res.on('data', (d) => console.log('Body:', d.toString()));
}).on('error', (e) => console.error(e));
