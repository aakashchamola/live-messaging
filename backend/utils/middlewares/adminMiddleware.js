// utils/middlewares/adminMiddleware.js
const userModel = require('../../models/userModel');
const { sendResponse } = require('../functions');

async function validateAdmin(req, res) {
  const userId = req.userId;
  const user = await userModel.findUser({id: userId});
  if (!user || !user.isAdmin) {
    sendResponse(res, 403, { message: 'Admin access required' });
    return false;
  }
  req.isAdmin = true;
  return true;
}

module.exports = {
  validateAdmin
};
