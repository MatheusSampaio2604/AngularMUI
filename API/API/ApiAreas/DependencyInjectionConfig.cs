using Infraestructure.Request.Interface;
using Infraestructure.User.Services;
using Infraestructure.User.Services.Interface;

namespace API.ApiAreas
{
    public static class DependencyInjectionConfig
    {
        public static IServiceCollection ResolveDependencies(this IServiceCollection services)
        {
            services.AddHttpClient<IHttpRequest, Infraestructure.Request.HttpRequest>();

            services.AddScoped<ITokenService, TokenService>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserGroupService, UserGroupService>();
            services.AddScoped<IUserPermissionService, UserPermissionService>();

            return services;
        }
    }
}
