
function sendResponse(res, statusCode,body){
 res.writeHead(statusCode, {'Content-Type': 'application/json'});
 res.end(JSON.stringify(body));
}

module.exports = {
    sendResponse
};