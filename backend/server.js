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

// Đăng ký CORS
server.register(fastifyCors, {
  origin: (origin, callback) => {
    if (corsWhiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  credentials: true,
});

// Đăng ký Socket.IO
server.register(fastifyIO, {
  cors: {
    origin: corsWhiteList,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// Định nghĩa route đơn giản kiểm tra server
server.get("/", (req, reply) => {
  reply.send("Init success");
});

// Cấu hình WebSocket
server.ready().then(() => {
  server.io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("notification/send", (msg) => {
      socket.broadcast.emit("notification/received", msg);
    });
  });
});

// Đăng ký các route chính của API
server.register(Routes, {
  prefix: "/api",
  whiteList: corsWhiteList,
});

// Khởi động máy chủ
const start = async () => {
  try {
    await server.listen({ host: ADDRESS, port: process.env.PORT });
    console.log(
      `🚀 Server is running on http://${ADDRESS}:${process.env.PORT}`
    );

    // Khởi động các job sau khi server đã sẵn sàng
    // startDestroyOrderJob();
    // startPaymentRequestCancelJob();
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1);
  }
};

start();