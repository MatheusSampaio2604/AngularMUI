
using API.ApiActionResult;
using API.ApiAreas;
using Infraestructure.General.SystemGeneral.Model;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //_ = LoggerConfig.AddLogger(builder);
            _ = GeneralConfigurations.Start(builder);

            _ = DependencyInjectionConfig.ResolveDependencies(builder.Services);


            // Add services to the container.

            builder.Services.AddControllers(opt => { opt.Filters.Add<ApiResponseFilter>(); });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(
                opt =>
                {
                    opt.EnableAnnotations();
                    opt.SwaggerDoc("v1", new OpenApiInfo
                    {
                        Version = "v1",
                        Title = "API Janus Automation",
                        Description = "For communication with internal items for project!",

                        Contact = new OpenApiContact
                        {
                            Name = "Janus Automation",
                            Url = new Uri("https://www.janusautomation.com/website/")
                        },
                    });

                    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.Http,
                        Scheme = "Bearer",
                        BearerFormat = "JWT",
                        Description = "Insira o token JWT como: Bearer {seu_token}"
                    });

                    // Aplica o esquema globalmente
                    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Id = "Bearer",
                                    Type = ReferenceType.SecurityScheme
                                }
                            },
                            Array.Empty<string>()
                        }
                    });
                }
            );

            builder.Services.AddAuthentication("Bearer")
            .AddJwtBearer("Bearer", options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = builder.Configuration["Configurations:Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Configurations:Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Configurations:Jwt:Key"]!))
                };
            });

            // CORS
            _ = builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });

            var app = builder.Build();

            // CORS
            _ = app.UseCors();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                //app.UseSwaggerUI();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Minha API v1");
                });
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();

            var logger = app.Services.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Aplicação iniciada com sucesso");

        }
    }
}
