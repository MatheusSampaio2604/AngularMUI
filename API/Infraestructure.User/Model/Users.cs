using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Infraestructure.User.Model
{
    public class Users
    {
        public required string Name { get; set; }
        public byte Level { get; set; }
        public required string Password { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool Enabled { get; set; }
        public required List<string> UserGroups { get; set; }
        //public List<UserGroups>? Groups { get; set; } = [];
    }
}
