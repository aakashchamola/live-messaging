// routes/userRoutes.js
const authMiddleware = require("../utils/middlewares/authMiddleware");
const userController = require('../controllers/userController');

function registerUserRoutes(router) {
  router.register(
    "GET",
    "/user/profile",
    async (req, res) => {
    const body = await parseRequestBody(req);
    await userController.getProfile(body, res);
    },
    [authMiddleware.validateSession]
  );

  router.register(
    "POST",
    "/user/edit-profile",
    async (req, res) => {
    const body = await parseRequestBody(req);
    await userController.editProfile(body, res);
    },
    [authMiddleware.validateSession]
  );

  router.register(
    "GET",
    "/user/logout",
    async (req, res) => {
      const body = await parseRequestBody(req);
      await userController.logoutUser(body, res);
    },
    [authMiddleware.validateSession]
  );

  router.register(
    "GET",
    "/user/delete-account",
    async (req, res) => {
      const body = await parseRequestBody(req);
      await userController.deleteUser(body, res);
    },
    [authMiddleware.validateSession]
  );
}

module.exports = registerUserRoutes;
