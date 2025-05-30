using Infraestructure.User.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.User.Services.Interface
{
    public interface IUserService
    {
        Task<IEnumerable<Users>> GetAllUsersAsync();
        Task<Users?> GetByNameAsync(string name);
        Task AddAsync(Users user);
        Task UpdateAsync(Users user);
        Task DeleteAsync(string name);
        Task ChangePasswordAsync(ChangePassword changePassword);


    }
}
