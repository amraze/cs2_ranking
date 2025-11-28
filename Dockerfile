# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy all csproj files and restore dependencies
COPY CS2Ranking.Domain/CS2Ranking.Domain.csproj CS2Ranking.Domain/
COPY CS2Ranking.Infrastructure/CS2Ranking.Infrastructure.csproj CS2Ranking.Infrastructure/
COPY CS2Ranking.Application/CS2Ranking.Application.csproj CS2Ranking.Application/
COPY CS2Ranking.Api/CS2Ranking.Api.csproj CS2Ranking.Api/

# Restore each project
RUN dotnet restore CS2Ranking.Api/CS2Ranking.Api.csproj

# Copy everything else
COPY . .

# Build and publish
RUN dotnet publish CS2Ranking.Api/CS2Ranking.Api.csproj -c Release -o /app/publish

# Stage 2: Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy the published app from build stage
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:8080

# Expose port
EXPOSE 8080

# Set the entry point
ENTRYPOINT ["dotnet", "CS2Ranking.Api.dll"]