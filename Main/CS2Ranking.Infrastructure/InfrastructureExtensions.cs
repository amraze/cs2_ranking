using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Infrastructure.Repositories;
using CS2Ranking.Infrastructure.ExternalServices;
using Microsoft.Extensions.DependencyInjection;
using CS2Ranking.Infrastructure.Startup;

namespace CS2Ranking.Infrastructure
{
    public static class InfrastructureExtensions
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IMatchRepository, MatchRepository>();
            services.AddScoped<IMapRepository, MapRepository>();
            services.AddScoped<IRankRepository, RankRepository>();
            services.AddScoped<ISeasonRepository, SeasonRepository>();
            services.AddHttpClient<IGoogleSheetsService, GoogleSheetsService>();
            services.AddHttpClient<IScopeGGService, ScopeGGService>();
            services.AddHostedService<ScopeGGStartupService>();
            return services;
        }
    }
}
