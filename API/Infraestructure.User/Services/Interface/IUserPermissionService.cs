using Infraestructure.User.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.User.Services.Interface
{
    public interface IUserPermissionService
    {
        Task<IEnumerable<UserPermissions>> GetAllPermissionsAsync();
        Task<UserPermissions?> GetByNameAsync(string name);
        Task AddAsync(UserPermissions permission);
        Task UpdateAsync(UserPermissions permission);
        Task DeleteAsync(string name);
    }
}
