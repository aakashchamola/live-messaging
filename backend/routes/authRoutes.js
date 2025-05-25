// routes/authRoutes.js
const authController = require('../controllers/authController');
const { parseRequestBody } = require('../utils/functions');

function registerAuthRoutes(router) {
  router.register('POST', '/auth/signup', async (req, res) => {
    const body = await parseRequestBody(req);
    await authController.signup(res, body);
  });

  router.register('POST', '/auth/login', async (req, res) => {
    const body = await parseRequestBody(req);
    await authController.login(res, body);
  });
}


module.exports = registerAuthRoutes;
