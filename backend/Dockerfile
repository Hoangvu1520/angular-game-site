# Sử dụng một image cơ sở có sẵn với Node.js
FROM node:18-alpine as BASE

# Tạo thư mục làm việc trong container
WORKDIR /backend

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies của ứng dụng
RUN npm install

# Sao chép mã nguồn ứng dụng vào thư mục làm việc
COPY . .

# Mở cổng mà ứng dụng sẽ lắng nghe (nếu có)
EXPOSE 8000

ENV ADDRESS=0.0.0.0
# Khởi chạy ứng dụng khi container được khởi động
CMD ["node", "server.js"]