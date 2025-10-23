using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;
public static class ServiceRegistration {
  public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration cfg) {
    services.AddDbContext<AppDbContext>(o => o.UseNpgsql(cfg.GetConnectionString("Default")));
    return services;
  }
}