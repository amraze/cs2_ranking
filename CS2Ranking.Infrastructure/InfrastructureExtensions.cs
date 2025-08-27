using CS2Ranking.Domain.Interfaces;
using CS2Ranking.Infrastructure.Repositories;
using CS2Ranking.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CS2Ranking.Infrastructure
{
    public static class InfrastructureExtensions
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IMatchRepository, MatchRepository>();
            services.AddScoped<IMapRepository, MapRepository>();
            services.AddHttpClient<IGoogleSheetsService, GoogleSheetsService>();
            return services;
        }
    }
}
