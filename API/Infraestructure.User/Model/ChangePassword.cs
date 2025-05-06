using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.User.Model
{
    public  class ChangePassword
    {
        public required string Name { get; set; }
        public required string NewPassword { get; set; }
    }
}
