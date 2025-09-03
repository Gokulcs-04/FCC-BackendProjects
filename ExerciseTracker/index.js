const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let users = [];
let username;
let logs = [];

let id_counter = 1;

// POST User data
app.post('/api/users', (req, res) => {
  username = req.body.username;
  let user = {username: username, _id: id_counter.toString()};
  users.push(user);
  logs.push(user);
  res.json(user);
  id_counter++;
})

// GET all users
app.get('/api/users', (req, res) => {
  res.send(users)
})

// POST Exercise data
app.post('/api/users/:_id/exercises', (req, res) => {
  let description = req.body.description;
  let duration = parseInt(req.body.duration);
  let date = req.body.date ? new Date(req.body.date) : new Date();
  let dateString = date.toDateString();
  let log = {description: description, duration: duration, date: dateString};
  logs.forEach(user => {
    if (user._id === req.params._id) {
      if (!user['log']) { 
        user['log'] = [log];
        user['count'] = 1;
      } else {
        user['log'].push(log);
        user['count'] += 1;
      }
    }
  });

  users.forEach(user => {
    if (user._id === req.params._id) {
      user['description'] = description;
      user['duration'] = duration;
      user['date'] = dateString;
    }
  });
  res.send(users.find(user => user._id === req.params._id));
});

// GET User's exercise log

app.get('/api/users/:_id/logs', (req, res) => {
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  const user = logs.find(user => user._id === req.params._id);

  let log = [...user.log];

  if (from) {
    const fromDate = new Date(from);
    if (!isNaN(fromDate)) {
      log = log.filter(e => new Date(e.date) >= fromDate);
    }
  }
  if (to) {
    const toDate = new Date(to);
    if (!isNaN(toDate)) {
      log = log.filter(e => new Date(e.date) <= toDate);
    }
  }

  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  const parameterized_log = {
    _id: user._id,
    username: user.username,
    count: log.length,
    log: log
  };
  res.json(parameterized_log);
});

// app.get('/api/users/:_id/logs', (req, res) => {
//   let from = req.query.from ? new Date(req.query.from) : null;
//   let to = req.query.to ? new Date(req.query.to) : null;
//   let limit = req.query.limit ? parseInt(req.query.limit) : null;
//   let log = logs.find(user => user._id === req.params._id).log;
//   if (from) {
//     log = log.filter(e => new Date(e.date) >= from);
//   }
//   if (to) {
//     log = log.filter(e => new Date(e.date) <= to);
//   }
//   if (limit) {
//     log = log.slice(0, limit);
//   }
//   logs.forEach(user => {
//     if (user._id === req.params._id) {
//       user['log'] = log;
//       user['count'] = log.length;
//     }
//   });
//   console.log(logs.find(user => user._id === req.params._id));
//   res.json(logs.find(user => user._id === req.params._id))
// });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
