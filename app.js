const express = require('express');
const app = express();
require('dotenv').config()
const fs = require('fs');
const http = require('http');
const https = require('https');
// const privateKey = fs.readFileSync('server.key','utf-8');
// const certificate = fs.readFileSync('server.cert', "utf-8");
const credentials = { key: process.env.SERVER_KEY, cert: process.env.SERVER_CERT };

/*CORS stands for Cross Origin Resource Sharing and allows modern web browsers to be able to send AJAX requests and receive HTTP responses for resource from other domains other that the domain serving the client side application.*/
const cors = require('cors');

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const bodyParser = require('body-parser');

// Our JWT logic. Uses express-jwt which is a middleware that validates JsonWebTokens and sets req.user.
const jwt = require('./_helpers/jwt');


// Our error handler
const errorHandler = require('./_helpers/error-handler');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(jwt());

app.use('/user', require('./routes/user.router'));
app.use('/campus', require('./routes/campus.router'));
app.use('/event', require('./routes/event.router'));
app.use('/organizations', require('./routes/organizations.router'));
app.use('/attendance', require('./routes/attendance.router'));
app.use('/excuse', require('./routes/excuses.router'));
app.get('/', function (req, res) {
  res.send('Panthropia Backend');
});
app.use(errorHandler);


// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3030;
const httpsServer = http.createServer(credentials, app);
httpsServer.listen(port, function () {
  console.log('Server listening on port ' + port);
});
