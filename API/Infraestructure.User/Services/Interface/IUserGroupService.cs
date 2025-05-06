using Infraestructure.User.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.User.Services.Interface
{
    public interface IUserGroupService
    {
        Task<IEnumerable<UserGroups>> GetAllGroupsAsync();
        Task<UserGroups?> GetByNameAsync(string name);
        Task AddAsync(UserGroups group);
        Task UpdateAsync(UserGroups group);
        Task DeleteAsync(string name);
    }
}
