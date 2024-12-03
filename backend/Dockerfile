FROM eclipse-temurin:21-jdk-alpine as build

WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

COPY --from=build /workspace/app/target/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseParallelGC -XX:MaxRAMPercentage=75"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app.jar"]