var https = require('https');

//create a server object:
https.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(8181); //the server object listens on port 8080
