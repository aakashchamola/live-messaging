const sessionModel = require('../../models/sessionModel');
const {sendResponse} = require('../functions');

async function validateSession(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    sendResponse(res, 401, { message: 'Authorization header missing' });
    return false;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    sendResponse(res, 401, { message: 'Token missing from Authorization header' });
    return false;
  }

  const session = sessionModel.getSession(token);
  if (!session) {
    sendResponse(res, 401, { message: 'Invalid or expired token' });
    return false;
  }
  
  req.session = session;
  req.userId = session.id;
  req.token = session.token;
  return true;
}

module.exports = {
  validateSession,
};
