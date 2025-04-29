FROM openjdk:17-jdk-slim

WORKDIR /app

# 전체 소스코드 복사
COPY . .

# Gradle Wrapper 실행 권한 부여
RUN chmod +x ./gradlew

# 빌드 (JAR 생성)
RUN ./gradlew bootJar --no-daemon

# 정적 리소스 포함한 모든 소스가 복사되어 있으므로 경로 접근 가능
EXPOSE 9988

ENTRYPOINT ["java", "-jar", "./build/libs/app.jar"]