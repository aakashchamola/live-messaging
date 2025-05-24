const http = require('http');
const {parseRequestBody, sendResponse}  = require('./utils/functions');
const authController = require('./controllers/authController');
const Router = require('./utils/router');

const router = new Router();

// Registering routes
router.register('POST', '/signup', async (req, res) => {
  const body = await parseRequestBody(req);
  await authController.signup(res, body);
});

router.register('POST', '/login', async (req, res) => {
  const body = await parseRequestBody(req);
  await authController.login(res, body);
});

router.register('GET', '/protected', async (req, res) => {
  const session = await authMiddleware.validateSession(req, res);
  if (!session) return; // authMiddleware sends response if invalid
  sendResponse(res, 200, { message: 'Access granted', session });
});



const server = http.createServer(async (req, res) => {
  router.handle(req,res);
});

server.listen(8001, () => {
  console.log('Server running on http://localhost:8001');
});
