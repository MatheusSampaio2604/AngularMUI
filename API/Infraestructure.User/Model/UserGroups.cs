using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.User.Model
{
    public class UserGroups
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public bool Enabled { get; set; }
        public required List<string> UserPermissions { get; set; }

    }
}
