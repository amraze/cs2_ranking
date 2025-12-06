#!/bin/bash
set -e

echo "⏳ Running database migrations..."
cd /src

dotnet ef database update --project CS2Ranking.Infrastructure --startup-project CS2Ranking.Api --context AppDbContext

echo "🚀 Starting API with seed data..."
cd /app
exec dotnet CS2Ranking.Api.dll --seed