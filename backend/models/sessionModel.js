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

function getSession({token,id}) {
  return sessions.find(s => 
    (!token || s.token === token) && (!id || s.userId === id)
  );
}

function removeSession({id,token}) {
   sessions.filter(session => {
    if (token && session.token === token) return false;
    if (id && session.userId === id) return false;
    return true;
  });
  saveSessions();
}

module.exports = {
  addSession,
  getSession,
  removeSession

};
