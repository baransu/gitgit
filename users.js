const fp = require('lodash/fp');

let users = {};

module.exports = {
  getUsers: () => ({ ...users }),

  getUser: id => fp.get(id, users),

  setUser: (id, user) => (users = fp.set(id, user, users)),

  updateUser: (id, fn) => (users = fp.update(id, fn, users))
};
