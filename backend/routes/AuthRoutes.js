const Controller = require("../controllers");
const authMiddleware = require("../middlewares/AuthMiddleware");
async function AuthRoutes(fastify, options) {
    fastify.post("/login", Controller.AuthController.login);
    fastify.get(
        "/logout",
        { preHandler: [authMiddleware] },
        Controller.AuthController.logout
    );
    fastify.get(
        "/check-auth",
        { preHandler: [authMiddleware] },
        Controller.AuthController.checkAuth
    );
    fastify.post(
        "/change-password",
        { preHandler: [authMiddleware] },
        Controller.AuthController.changePassword
    );
    fastify.post("/register", Controller.AuthController.registerAccumulate);
    fastify.post("/verify", Controller.AuthController.verifyAccount);
    fastify.get(
        "/user",
        { preHandler: [authMiddleware] },
        Controller.AuthController.refreshUserData
    );
    fastify.post(
        "/user",
        { preHandler: [authMiddleware] },
        Controller.AuthController.UpdateUserData
    );
    fastify.post(
        "/user/password",
        { preHandler: [authMiddleware] },
        Controller.AuthController.CheckPassword
    );
    fastify.get(
        "/forgot-password/:email",
        Controller.AuthController.ForgotPasswordOtp
    );
    fastify.post(
        "/forgot-password/check-otp",
        Controller.AuthController.ForgotPasswordCheckOtp
    );
    fastify.post("/forgot-password", Controller.AuthController.ForgotPassword);
    fastify.post(
        "/delete",
        { preHandler: [authMiddleware] },
        Controller.AuthController.DeleteAccount
    );
}

module.exports = AuthRoutes;