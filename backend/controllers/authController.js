const bcrypt = require('bcrypt');
const {randomUUID} = require('crypto');
const userModel = require('../models/userModel');
const func = require('../utils/functions');
const sessionModel = require('../models/sessionModel');
async function signup(res, reqBody) {
    const {email,name, password} = reqBody;
   if (!email || !name || !password) {
         return func.sendResponse(res, 400, { message: "Email, name, and password are required", body: reqBody });
   }

    
    if(userModel.findUserByEmail(email)) {
    return func.sendResponse(res,400,{message:"User Email Already Exists", body: reqBody})
    }
    const HashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: randomUUID(),
        name,
        email,
        password: HashedPassword,
        createdAt: new Date().toISOString()
    }
    userModel.addUser(newUser);
    return func.sendResponse(res,201,{message: "User Sign up Successfully",body: {name,email}});
}

async function login(res,reqBody) {
   const {email, password} = reqBody;
    if(!email || !password){
        return func.sendResponse(res, 400, { message: "Email and password field required", body: reqBody });
    }
    const user = userModel.findUserByEmail(email);
     if(!user) {
    return func.sendResponse(res,400,{message:"User Email does not Exists", body: reqBody})
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) {
    return func.sendResponse(res, 401, { message: "Invalid credentials." });
    }
    const token = randomUUID();
    newSession = { token, userId: user.id, createdAt: new Date().toISOString() };
    sessionModel.addSession(newSession);
    return func.sendResponse(res, 200, { message: "Login Successfully", token,user: {id:user.id,name: user.name,email: user.email} });
}
module.exports = {
    signup,
    login
};