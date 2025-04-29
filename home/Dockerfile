# Node.js 이미지 사용
FROM node:16

# 애플리케이션 소스 코드 복사
WORKDIR /app
COPY . /app

# 의존성 설치
RUN npm install

# 빌드
RUN npm run build || { echo 'Build failed'; tail -f /dev/null; }

# React 앱을 실행
CMD ["npm", "start"]