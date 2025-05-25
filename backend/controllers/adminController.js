const usersModel = require("../models/userModel");
const { sendResponse } = require("../utils/functions");
const sessionModel = require("../models/sessionModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

async function signup(req, res) {
  const { email, name, password } = req;
  if (!email || !name || !password) {
    return sendResponse(res, 400, {
      message: "Email, name, and password are required",
      body: req,
    });
  }

  if (usersModel.findUser({ email: email })) {
    return sendResponse(res, 400, {
      message: "User Email Already Exists",
      body: req,
    });
  }
  const HashedPassword = await bcrypt.hash(password, 20);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: HashedPassword,
    createdAt: new Date().toISOString(),
    isAdmin: true,
  };
  usersModel.addUser(newUser);
  return sendResponse(res, 201, {
    message: "Admin User Sign up Successfully",
    body: { name, email },
  });
}

async function login(req, res) {
  const { email, password } = req;
  if (!email || !password) {
    return sendResponse(res, 400, {
      message: "Email and password field required",
      body: req,
    });
  }
  const user = usersModel.findUser({ email: email });
  if (!user) {
    return sendResponse(res, 400, {
      message: "Admin User Email does not Exists",
      body: req,
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return sendResponse(res, 401, { message: "Invalid credentials." });
  }
  const token = uuidv4();
  const newSession = {
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
    isAdmin: true,
  };
  sessionModel.addSession(newSession);
  return sendResponse(res, 200, {
    message: "Admin Login Successfully",
    token,
    user: { id: user.id, name: user.name, email: user.email, isAdmin: true },
  });
}

async function getUsers(req,res) {
  const users = usersModel.getUsers();
  return sendResponse(res, 200, {
    message: "Users Fetched Successfully",
    body: users,
  });
}

async function logoutAdmin(req, res) {
  const token = req.token;
  sessionModel.removeSession({ token: token });
  return sendResponse(res, 200, { message: "Admin Logged Out Successfully" });
}

async function deleteUsers(req, res) {
  const { ids } = req;
  if (!Array.isArray(ids) || ids.length === 0) {
    return sendResponse(res, 400, {
      message: "need a non empty array of id's in a KeyField named - 'ids'",
    });
  }
  let validUsers = [];
  let invalidUsers = [];
  for (const id of ids) {
    if (await usersModel.findUser({ id: id })) {
      validUsers.push(id);
    } else {
      invalidUsers.push(id);
    }
  }
  if (validUsers.length === 0) {
    return sendResponse(res, 400, {
      message: "No Registered User Found",
      body: { invalidUsers },
    });
  }
  usersModel.deleteUsers(validUsers);
  return sendResponse(res, 200, {
    message: "All Valid Id's in the request Have been Deleted",
    body: { deletedUsers: validUsers, invalidUsers: invalidUsers },
  });
}
module.exports = {
  signup,
  login,
  getUsers,
  deleteUsers,
  logoutAdmin,
};
