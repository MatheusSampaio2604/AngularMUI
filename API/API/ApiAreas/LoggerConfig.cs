using Serilog;

namespace API.ApiAreas
{
    public static class LoggerConfig
    {
        public static WebApplicationBuilder AddLogger(this WebApplicationBuilder builder)
        {
            _ = builder.Logging.ClearProviders();

            // Configuração do Serilog
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Configuration.GetSection("Serilog"))
                .CreateLogger();

            //_ = builder.Logging.AddConsole(); // Log no console
            _ = builder.Host.UseSerilog((context, services, configuration) => configuration
            .ReadFrom.Configuration(context.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext());


            return builder;
        }
    }
}
