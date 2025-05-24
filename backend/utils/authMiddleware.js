const sessionModel = require('../models/sessionModel');
const func = require('./functions');

async function validateSession(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    func.sendResponse(res, 401, { message: 'Authorization header missing' });
    return null;
  }

  // Expected format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    func.sendResponse(res, 401, { message: 'Token missing from Authorization header' });
    return null;
  }

  const session = sessionModel.getSession(token);
  if (!session) {
    func.sendResponse(res, 401, { message: 'Invalid or expired token' });
    return null;
  }
  
  return session;
}

module.exports = {
  validateSession,
};
