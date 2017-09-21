const fp = require('lodash/fp');

const { INSTALLED } = require('../achievements');

module.exports = function(body, users) {
  const { sender } = body;
  const login = sender.login.toLowerCase();
  if (sender.type === 'User') {
    if (!fp.has(login, users.getUsers())) {
      users.setUser(login, {
        ...sender,
        reputation: INSTALLED.reputation,
        achievements: [INSTALLED.id]
      });
      console.log(`User ${login} installed an application!`);
    }
  }
};
