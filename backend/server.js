const http = require('http');
const fs = require('fs');
const { randomUUID } = require('crypto');
const DB_FILE = './users.json';
let users = [];
if (fs.existsSync(DB_FILE)) {
  const data = fs.readFileSync(DB_FILE, 'utf8').trim();
  if (data) {
    try {
      users = JSON.parse(data);
    } catch (err) {
      console.error("Invalid JSON in users.json. Resetting to empty array.");
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  }
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  });
}
function saveUsersToFile() {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function sendResponse(res, statusCode,body){
res.writeHead(statusCode, {'Content-Type': 'application/json'});
res.end(JSON.stringify(body));
}
function userExists(email){
  return users.find(user => user.email == email);
}

function getUsers(res){
  sendResponse(res,200,{message: "Users Fetched Successfully", body: users});
}

function addUser(res ,reqBody){
  if(!reqBody.email || !reqBody.name){
   return sendResponse(res,400,{message:"Invalid Json Data, need email and name field", body: reqBody})
  }

if(userExists(reqBody.email)) {
 return sendResponse(res,400,{message: "User Email Already Exists",  body: reqBody});
}
const newUser = {id: randomUUID(), name: reqBody.name, email: reqBody.email};
users.push(newUser);
saveUsersToFile();
return sendResponse(res,200,{message: "User Added Successfully",body: newUser});
}

function updateUser(res, reqBody){
  if(!reqBody.email || !reqBody.name){
   return sendResponse(res,400,{message:"Invalid Json Data, need email and name field", body: reqBody});
  }
  if(!userExists(reqBody.email)){
   return sendResponse(res,400, {message: "User Not Found, User Email does not Exists", body: reqBody});
  }
  const index = users.findIndex(user => user.email == reqBody.email);
  users[index].name = reqBody.name;
  saveUsersToFile();
return sendResponse(res, 200,{message: "User Updated Successfully", body: reqBody});
}

function deleteUser(res, reqBody){
  if(!reqBody.email){
   return sendResponse(res,400,{message:"Invalid Json Data, need email field required", body: reqBody});
  }
  if(!userExists(reqBody.email)){
   return sendResponse(res,400, {message: "User Not Found, User Email does not Exists", body: reqBody});
  }
  users = users.filter(user => user.email !== reqBody.email);
  saveUsersToFile();
  return sendResponse(res, 200,{message: "User Deleted Successfully", body: reqBody});
}
const server = http.createServer(async (req,res)=>{
  let reqBody;
  try{
  if(req.method =="GET" && req.url == "/users")return getUsers(res);
  if(["POST", "PUT" ,"DELETE"].includes(req.method)){
    reqBody = await parseRequestBody(req);
  if(req.method=="POST" && req.url == "/users")return addUser(res, reqBody);
  if(req.method=="PUT" && req.url == "/users")return updateUser(res ,reqBody);
  if(req.method=="DELETE" && req.url == "/users")return deleteUser(res ,reqBody); 
}
  return sendResponse(res, 404, {message: "Page Not Found, Route Incorrect"});
} catch(err){
    console.log("Unknown Error Occurred");
  return  sendResponse(res,400,{message: "Internal Server Error"});
  }
})

server.listen(8001, ()=>{
  console.log("Server Running on Port 8001");
}
);
