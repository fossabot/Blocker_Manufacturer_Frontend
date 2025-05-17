# 베이스 이미지로 Node.js 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치를 위한 package.json과 lock 파일만 먼저 복사
COPY package*.json ./

# nodemon 설치 (개발용 핫리로드)
RUN npm install -g nodemon

# 의존성 설치
RUN npm install

# 나머지 소스 코드 복사
COPY . .

# 개발 서버 포트 설정
EXPOSE 3000

# 개발 서버 실행 (npm start 사용)
CMD ["npm", "start"]