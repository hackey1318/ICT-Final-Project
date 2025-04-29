# Node.js 이미지 사용
FROM node:16 as build

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

# nginx 이미지 사용
FROM nginx:alpine

# 빌드된 파일을 nginx 서버에 복사
COPY --from=build /app/build /usr/share/nginx/html

# nginx 설정 파일 복사
COPY ./nginx.conf /etc/nginx/nginx.conf

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]
