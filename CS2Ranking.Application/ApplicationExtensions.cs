using CS2Ranking.Application.Services;
using CS2Ranking.Application.Interfaces;

namespace CS2Ranking.Application
{
    public static class ApplicationExtensions
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IMatchService, MatchService>();
            services.AddScoped<IMapService, MapService>();
            return services;
        }
    }
}
