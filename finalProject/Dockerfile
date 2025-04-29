# 1단계: Gradle 빌드용 이미지
FROM gradle:8.5-jdk17 AS builder

WORKDIR /app

# 전체 소스코드를 컨테이너로 복사
COPY . .

# Gradle 빌드 실행 (JAR 파일 생성)
RUN gradle clean build --no-daemon

# 2단계: 실행용 경량 이미지
FROM openjdk:17-jdk-slim

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar
# build 폴더를 그대로 복사하여 이미지에 포함
COPY --from=builder /app/build /app/build

# 실행할 JAR 파일 실행
EXPOSE 9988
ENTRYPOINT ["java", "-jar", "app.jar"]