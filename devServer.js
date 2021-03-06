const path = require('path');
const express = require('express');
const http = require('http');
//cors - cross origin resource sharing 
const cors = require('cors');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const bodyParser = require('body-parser');
const app = express();
const router = require('./server/router');
const mongoose = require('mongoose');
const server = http.createServer(app);
const io = module	.exports.io = require('socket.io')(server);
const SocketServer= require('./server/socket_server');
const compiler = webpack(config);

//Used the below to test if I was getting a process.env
// require('dotenv').config();
// app.get('/hellocreds', (req, res) => {
// 	res.send(process.env.SENTRY_KEY);
// })

//----------Database stuff-------------------
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/colony";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Successfully connected");
});
//----------End DB Stuff---------------------

app.use(cors());
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(bodyParser.json({type: '*/*'}));
// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

router(app, io);

io.on('connection', SocketServer);

const PORT = process.env.PORT || 7770;
server.listen(PORT, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost: ', PORT);
});
