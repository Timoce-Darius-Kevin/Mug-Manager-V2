# Use Maven to build the Spring Boot app
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom and sources
COPY pom.xml ./
COPY src ./src

# Build (skip tests for faster container builds)
RUN mvn -B clean package -DskipTests

# Runtime image
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy fat jar
COPY --from=build /app/target/*.jar /app/app.jar

# Environment (override at runtime as needed)
# ENV AUTH0_ISSUER_URI="" 
# ENV AUTH0_AUDIENCE="" 
# ENV AUTH0_ROLES_CLAIM="roles"

EXPOSE 8080

# Pass extra JVM args via JAVA_OPTS if needed
ENV JAVA_OPTS=""
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
