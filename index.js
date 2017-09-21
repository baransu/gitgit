const fp = require('lodash/fp');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const users = require('./users');
const events = require('./events');
const achievements = require('./achievements');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.post('/watch', (req, res, next) => {
  const { headers, body } = req;
  const eventType = headers['x-github-event'];
  const fn = events[eventType];
  if (fp.isFunction(fn)) {
    fn(body, users);
  } else {
    console.log('Unsupported event type', eventType);
  }
});

app.get('/v1/users/:userId', (req, res, next) => {
  const { userId } = req.params;
  const user = users.getUser(userId);
  console.log(users.getUser());
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ error: 'user_not_found' });
  }
});

app.get('/v1/achievements', (req, res, next) => {
  res.json({ achievements: fp.values(achievements) });
});

app.get('/v1/achievements/:achievementId', (req, res, next) => {
  const { achievementId } = req.params;
  const achievement = fp.get(achievementId, achievements);
  if (achievement) {
    res.json({ achievement });
  } else {
    res.status(404).json({ error: 'achievement_not_found' });
  }
});

app.listen(PORT, () => console.log('Starting server at', PORT));
