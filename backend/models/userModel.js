const fs = require("fs");
const path = require("path");
const usersFile = path.join(__dirname, "../db/users.json");
const sessions = require("./sessionModel");
function getUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, "utf-8");
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf-8");
}

function findUser({ id, email, token }) {
  const users = getUsers();

  let userIdFromSession = null;
  if (token) {
    const session = sessions.getSession(token);
    if (!session) return null;
    userIdFromSession = session.userId;
  }

  return users.find(user =>
    (!id || user.id === id) &&
    (!email || user.email === email) &&
    (!token || user.id === userIdFromSession)
  );
}


function isUserAdmin({ id, email, token }) {
  const user = findUser({ id, email, token });
  return user ? user.isAdmin === true : false;
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

function updateUser(id, body) {
  const users = getUsers();
  const userIndex = users.findIndex((user) => user.id == id);
  const updatedUser = { ...users[userIndex], ...body };
  users[userIndex] = updatedUser;
  saveUsers(users);
  return updatedUser;
}
function deleteUsers(ids) {
  const users = getUsers();
  const updatedUsers = users.filter((user) => !ids.includes(user.id));
  saveUsers(updatedUsers);
}

module.exports = {
  getUsers,
  saveUsers,
  findUser,
  addUser,
  isUserAdmin,
  updateUser,
  deleteUsers,
};
