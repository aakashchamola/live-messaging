const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '../db/users.json');


function getUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, 'utf-8');
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
}

function findUserByEmail(email) {
  const users = getUsers();
  console
  return users.find(user => user.email === email);
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

module.exports = {
  getUsers,
  saveUsers,
  findUserByEmail,
  addUser
};