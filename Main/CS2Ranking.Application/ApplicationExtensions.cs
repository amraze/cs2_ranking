using CS2Ranking.Application.Interfaces.IServices;
using CS2Ranking.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CS2Ranking.Application
{
    public static class ApplicationExtensions
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IMapService, MapService>();
            services.AddScoped<IMatchService, MatchService>();
            services.AddScoped<IRankService, RankService>();
            services.AddScoped<ISeasonService, SeasonService>();
            return services;
        }
    }
}
