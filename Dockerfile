# 1️⃣ Sử dụng Node.js 18 để build app
FROM node:18 AS build

# 2️⃣ Thiết lập thư mục làm việc trong container
WORKDIR /app

# 3️⃣ Copy package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# 4️⃣ Cài đặt dependencies
RUN npm install

# 5️⃣ Copy toàn bộ project vào container
COPY . .

# 6️⃣ Build app React
RUN npm run build

# 7️⃣ Sử dụng nginx để chạy app sau khi build
FROM nginx:alpine

# 8️⃣ Copy file build vào thư mục `/usr/share/nginx/html` của nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 9️⃣ Copy file cấu hình nginx vào container
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 🔟 Mở port 80
EXPOSE 80

# 1️⃣1️⃣ Chạy nginx
CMD ["nginx", "-g", "daemon off;"]
