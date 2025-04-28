# JDK 이미지 사용
FROM openjdk:17-jdk-slim

# JAR 파일을 컨테이너에 복사
COPY target/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app.jar"]