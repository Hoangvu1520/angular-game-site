const fastify = require("fastify");
const fastifyIO = require("fastify-socket.io");
const dotenv = require("dotenv");
const Routes = require("./routes");
const fastifyCors = require("@fastify/cors");
const fastifyCookie = require("@fastify/cookie");

dotenv.config()

const server = fastify({ logger: true, bodyLimit: 104857600 });

// Cấu hình danh sách domain được phép truy cập CORS
const corsWhiteList = [
    process.env.CLIENT_ORIGIN,
    process.env.CMS_ORIGIN,
    process.env.MOBILE_ORIGIN,
    process.env.IOS_ORIGIN,
];

const { ADDRESS = "localhost" } = process.env;

// Đăng ký plugin cookie
server.register(fastifyCookie, {
  secret: "my-secret", // dùng để ký mã hóa cookie nếu dùng signed cookies
});


start();