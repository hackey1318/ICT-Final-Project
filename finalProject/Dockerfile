FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

# 전체 소스코드 복사
COPY . .

# Gradle Wrapper 실행 권한 부여
RUN chmod +x ./gradlew

# 빌드 (JAR 생성)
RUN ./gradlew bootJar --no-daemon

# 2단계: 실행용 경량 이미지
FROM openjdk:17-jdk-slim

WORKDIR /app

# 빌드된 전체 build 디렉토리 복사 (빌드 후 결과물 포함)
COPY --from=builder /app/build /app/build

# 실행 포트 노출
EXPOSE 9988

# 정확한 JAR 파일명으로 수정
ENTRYPOINT ["java", "-jar", "./build/libs/finalProject-0.0.1-SNAPSHOT.jar"]
