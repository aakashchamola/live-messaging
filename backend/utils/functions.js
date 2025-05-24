
function sendResponse(res, statusCode,body){
 res.writeHead(statusCode, {'Content-Type': 'application/json'});
 res.end(JSON.stringify(body));
}
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

module.exports = {
    sendResponse,
    parseRequestBody
};