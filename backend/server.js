const http = require('http');
const func = require('./utils/functions');
const authController = require('./controllers/authController');

// Body parser
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

const server = http.createServer(async (req, res) => {
  try {
    let reqBody = null;
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
      reqBody = await parseRequestBody(req);
    }

    // Routes
    if (req.method === 'POST' && req.url === '/signup') {
      return authController.signup(res,reqBody);
    }

    if (req.method === 'POST' && req.url === '/login') {
      return authController.login(res,reqBody);
    }
    // Not found route
    return func.sendResponse(res, 404, { message: 'Route not found' });

  } catch (err) {
    console.error('Error:', err.message);
    return func.sendResponse(res, 500, { message: 'Internal Server Error' });
  }
});

server.listen(8001, () => {
  console.log('Server running on http://localhost:8001');
});
