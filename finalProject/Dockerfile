# 1단계: 빌드용 이미지
FROM gradle:8.5-jdk17 AS builder

WORKDIR /app
COPY . .

# Gradle 캐시 활용 + 애플리케이션 빌드
RUN gradle bootJar --no-daemon

# 2단계: 실행용 경량 이미지
FROM openjdk:17-jdk-slim

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 컨테이너 포트 열기
EXPOSE 9988

# 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]
