const { verifyToken } = require("../utils/jwt");

const authMiddleWare = async (req, reply) => {
    const clearTokenCookie = (res) => {
        process.env.ENV == "dev"
            ? res.setCookie("Access_token", "/", {
                // domain: ".vietagold.com.vn",
                path: "/",
                maxAge: 21600, // 6 hours
                httpOnly: true,
                sameSite: "Lax",
                // secure: true, // Chỉ thiết lập secure nếu đang ở môi trường production
            })
            : res.setCookie("Access_token", "/", {
                domain: ".vietagold.com.vn",
                path: "/",
                maxAge: 21600, // 6 hours
                httpOnly: true,
                sameSite: "None",
                secure: true, // Chỉ thiết lập secure nếu đang ở môi trường production
            });
    };

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        clearTokenCookie(reply);
        return reply
            .status(401)
            .send({ error: "No token provided, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = await verifyToken(token);

        // Get current time in seconds since epoch
        const currentTime = Math.floor(Date.now() / 1000);

        // Check if token has expired
        if (decoded.exp < currentTime) {
            clearTokenCookie(reply);
            return reply.status(401).send({ error: "Token has expired" });
        }

        req.user = decoded; // Add the decoded user information to the request object
    } catch (err) {
        clearTokenCookie(reply);
        return reply.status(401).send({ error: "Token is not valid" });
    }
}

module.exports = authMiddleware;