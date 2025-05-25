const userModel = require("../models/userModel");
const { sendResponse } = require("../utils/functions");
const sessionModel = require("../models/sessionModel");

async function getProfile(reqBody, res) {
  const userId = reqBody.userId;
  const userProfile = userModel.findUser({ id: userId });
  if (!userProfile) {
    return sendResponse(res, 404, { message: "User not found" });
  }
  return sendResponse(res, 200, {
    message: "User Profile Fetched Successfully",
    body: userProfile,
  });
}

async function editProfile(reqBody, res) {
  const userId = reqBody.userId;
  const userProfile = await userModel.findUser({ id: userId });
  if (!userProfile) {
    return sendResponse(res, 404, { message: "User not found" });
  }
  const updatedUser = await userModel.updateUser(userId, reqBody.body);
  return sendResponse(res, 201, { user: updatedUser });
}

async function logoutUser(reqBody, res) {
  const userId = reqBody.userId;
  const user = await userModel.findUser({ id: userId });
  if (!user) {
    return sendResponse(res, 404, { message: "User not found" });
  }
  sessionModel.removeSession({ id: userId });
  return sendResponse(res, 200, { message: "User Logged Out Successfully" });
}

async function deleteUser(reqBody, res) {
  const userId = reqBody.userId;
  const user = await userModel.findUser({ id: userId });
  if (!user) {
    return sendResponse(res, 404, { message: "User not found" });
  }
  sessionModel.removeSession({ id: userId });
  const ids = [userId];
  userModel.deleteUsers(ids); // delete users take array of id's
  sendResponse(res, 200, { message: "User Logged Out Successfully" });
}
module.exports = {
  getProfile,
  editProfile,
  logoutUser,
  deleteUser,
};
