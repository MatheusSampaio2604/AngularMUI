using Infraestructure.General.SystemGeneral.Model;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.ApiAreas
{
    public static class GeneralConfigurations
    {
        public static WebApplicationBuilder Start(this WebApplicationBuilder builder)
        {
            Configurations externalSettings = builder.Configuration.GetSection("Configurations").Get<Configurations>()!;
            _ = builder.Services.AddSingleton(externalSettings);
            return builder;
        }
    }

}
