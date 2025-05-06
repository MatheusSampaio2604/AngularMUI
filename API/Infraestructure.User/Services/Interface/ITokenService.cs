using Infraestructure.User.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.User.Services.Interface
{
    public interface ITokenService
    {
        string GenerateToken(Users user);
    }
}
