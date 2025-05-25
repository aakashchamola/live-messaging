const http = require('http');
const Router = require('./utils/router');
const registerAuthRoutes = require('./routes/authRoutes');
const registerAdminRoutes = require('./routes/adminRoutes');
const registerUserRoutes = require('./routes/userRoutes');
const router = new Router();

// registerring routes
registerAdminRoutes(router);
registerAuthRoutes(router);
registerUserRoutes(router);

const server = http.createServer(async (req, res) => {
  router.handle(req,res);
});

server.listen(8001, () => {
  console.log('Server running on http://localhost:8001');
});
