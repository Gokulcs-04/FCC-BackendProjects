require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
let idCounter = 1;
let urlDatabase = {};

app.post('/api/shorturl', function(req, res) {
  let originalUrl = req.body.url;
  if (!originalUrl) {
    return res.json({ error: 'No URL provided' });
  }

  // Handle URL shortening logic here
  if (!/^https?:\/\//i.test(originalUrl)) {
    return res.json({ error: 'Invalid URL' });
  }

  let shortUrl = idCounter++;
  urlDatabase[shortUrl] = originalUrl;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  let shortUrl = req.params.short_url;
  let originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: 'No short URL found for the given input' });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
