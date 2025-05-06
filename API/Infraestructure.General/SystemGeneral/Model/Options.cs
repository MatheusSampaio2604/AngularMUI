using Infraestructure.General.SystemGeneral.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.General.SystemGeneral.Model
{
    public class ConnectionStrings
    {
        public string? DbRoute { get; set; }
    }

    public class UserFolder
    {
        public required string UserPath { get; set; }
        public required string UserGroupPath { get; set; }
        public required string UserPermissionPath { get; set; }
    }

    public class ApiConfig
    {
        public string? ApiKey { get; set; }
        public string? ApiUrl { get; set; }
    }

    public class Rodeo
    {
        public required string RodeoSector { get; set; }
        public required string HostName { get; set; }
    }

    public class TimeLoop
    {
        public int TimeLoopInterval { get; set; }
        public TimeType TimeLoopIntervalUnit { get; set; }
    }

    public class Jwt
    {
        public string? Key { get; set; }
        public string? Issuer { get; set; }
        public string? Audience { get; set; }
        public int ExpirationTime { get; set; }
        public TimeType ExpirationTimeUnit { get; set; }
    }
}
