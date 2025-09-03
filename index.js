// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:date/", function (req, res) {
  let dateString = req.params.date;
  let date;
  // Check if dateString is a number
  if (!isNaN(dateString)) {
    date = new Date(parseInt(dateString));
  } else {
    date = new Date(dateString);
  }
  // If date is invalid, return error
  if (date.toString() === "Invalid Date") {
    return res.json({error: "Invalid Date"});
  }
 
  res.json({unix: date.getTime(), utc: date.toUTCString()});
}
);
app.get("/api", function (req, res) {
  // Return current time in unix and utc format
  let date = new Date();
  res.json({unix: date.getTime(), utc: date.toUTCString()});
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
