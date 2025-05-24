const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, '../db/sessions.json');

let sessions = fs.existsSync(DB_FILE)
  ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
  : [];

function saveSessions() {
  fs.writeFileSync(DB_FILE, JSON.stringify(sessions, null, 2), 'utf8');
}

function addSession(session) {
  sessions.push(session);
  saveSessions();
}

function getSession(token) {
  return sessions.find(s => s.token === token);
}

module.exports = {
  addSession,
  getSession
};
