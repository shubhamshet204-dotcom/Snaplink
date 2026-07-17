# Stage 1: Build the Maven application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first to speed up builds (cache layer)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Create the lightweight runtime image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/snaplink-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8082

# Run the jar with active profiles or variables
ENTRYPOINT ["java", "-jar", "app.jar"]
