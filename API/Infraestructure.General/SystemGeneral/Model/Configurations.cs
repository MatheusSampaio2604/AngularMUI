using Infraestructure.General.SystemGeneral.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.General.SystemGeneral.Model
{
    public class Configurations
    {
        public bool TestMode { get; set; }
        public ConnectionStrings? ConnectionStrings { get; set; }
        public required UserFolder UserFolder { get; set; }
        public ApiConfig? ApiConfig { get; set; }
        public Rodeo? Rodeo { get; set; }
        public TimeLoop? TimeLoop { get; set; }
        public Jwt? Jwt { get; set; }
    }
}
