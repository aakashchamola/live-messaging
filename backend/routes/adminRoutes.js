// routes/adminRoutes.js
const adminMiddleware = require("../utils/middlewares/adminMiddleware");
const authMiddleware = require("../utils/middlewares/authMiddleware");
const { parseRequestBody } = require("../utils/functions");
const adminController = require("../controllers/adminController");

function registerAdminRoutes(router) {
  router.register(
    "POST",
    "/admin/signup",
    async (req, res) => {
      const body = await parseRequestBody(req);
      await adminController.signup(body, res);
    },
    []
  );

  router.register(
    "POST",
    "/admin/login",
    async (req, res) => {
      const body = await parseRequestBody(req);
      await adminController.login(body, res);
    },
  );

  router.register(
    "GET",
    "/admin/get-users",
    async (req, res) => {
      const body = await parseRequestBody(req);
      await adminController.getUsers(body,res);
    },
    [authMiddleware.validateSession,adminMiddleware.validateAdmin]
  );
  router.register(
    "DELETE",
    "/admin/delete-users",
    async (req, res) => {
      const body = await parseRequestBody(req);
      await adminController.deleteUsers(body, res);
    },
  [authMiddleware.validateSession,adminMiddleware.validateAdmin]
  );
  router.register(
    "POST",
    "/admin/logout",
    async (req, res) => {
      const body = await parseRequestBody(req);
      await adminController.logoutAdmin(body, res);
    },
  [authMiddleware.validateSession,adminMiddleware.validateAdmin]
  );
}
module.exports = registerAdminRoutes;


