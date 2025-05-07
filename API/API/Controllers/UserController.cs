using Infraestructure.General.SystemGeneral.Model;
using Infraestructure.User.Model;
using Infraestructure.User.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Annotations;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(ILogger<UserController> logger,
                            Configurations general,
                            IUserService userService,
                            IUserGroupService userGroupService,
                            IUserPermissionService userPermissionService,
                            ITokenService tokenService) : ControllerBase
    {
        private readonly ILogger<UserController> _logger = logger;
        private readonly Configurations _general = general;
        private readonly IUserService _userService = userService;
        private readonly IUserGroupService _userGroupService = userGroupService;
        private readonly IUserPermissionService _userPermissionService = userPermissionService;
        private readonly ITokenService _tokenService = tokenService;

        #region Access Request / Access Token / Change Password

        [Authorize(Roles = "Operator,Administrator,Supervisor")]
        [HttpPost(nameof(ChangePassword))]
        [SwaggerOperation(Summary = "Change password", Description = "Change password from user.")]
        public async Task<IActionResult> ChangePassword(ChangePassword obj)
        {
            if (obj == null || obj.Name == "" || obj.NewPassword == "") throw new NullReferenceException("Data cannot be null");
            try
            {
                await _userService.ChangePasswordAsync(obj);
                return Ok(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(ChangePassword));
                throw;
            }
        }

        [AllowAnonymous]
        [HttpPost(nameof(LoginRequest))]
        [SwaggerOperation(Summary = "Login User", Description = "Login user.")]
        public async Task<IActionResult> LoginRequest(LoginRequest login)
        {
            try
            {
                Users? user = await _userService.GetByNameAsync(login.Username);
                if (user == null) return NotFound("User not found");
                if (user.Password != login.Password) return Unauthorized("User Username or Password are incorrect.");

                return Ok(_tokenService.GenerateToken(user));
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(ChangePassword));
                throw;
            }
        }

        #endregion

        #region Users

        // GET: UserController
        [Authorize(Roles = "Administrator,Supervisor")]
        [HttpGet, Route("users")]
        [SwaggerOperation(Summary = "List Users", Description = "List All Enabled Users.")]
        public async Task<IActionResult> Users()
        {
            try
            {
                return Ok(await _userService.GetAllUsersAsync());
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(Users));
                throw;
            }
        }

        [Authorize(Roles = "Operator,Administrator,Supervisor")]
        [HttpGet(nameof(GetUserByName))]
        [SwaggerOperation(Summary = "Get user by name", Description = "Get user by name.")]
        public async Task<IActionResult> GetUserByName(string name)
        {
            try
            {
                return Ok(await _userService.GetByNameAsync(name));
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(GetUserByName));
                throw;
            }
        }

        [Authorize(Roles = "Administrator,Supervisor")]
        [HttpPost(nameof(CreateUserAsync))]
        [SwaggerOperation(Summary = "Create new user", Description = "Create a new user access.")]
        public async Task<IActionResult> CreateUserAsync(Users user)
        {
            if (user == null) throw new NullReferenceException("Data cannot be null");
            try
            {
                await _userService.AddAsync(user);
                return Ok(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(CreateUserAsync));
                throw;
            }
        }

        [Authorize(Roles = "Administrator,Supervisor")]
        [HttpPut(nameof(UpdateUserAsync))]
        [SwaggerOperation(Summary = "Update user data", Description = "update user data.")]
        public async Task<IActionResult> UpdateUserAsync(Users user)
        {
            if (user == null) throw new NullReferenceException("Data cannot be null");
            try
            {
                await _userService.UpdateAsync(user);
                return Ok(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(UpdateUserAsync));
                throw;
            }
        }

        [Authorize(Roles = "Administrator,Supervisor")]
        [HttpDelete(nameof(DeleteUser))]
        [SwaggerOperation(Summary = "Delete user by name", Description = "Delete user by Name.")]
        public async Task<IActionResult> DeleteUser(string name)
        {
            try
            {
                await _userService.DeleteAsync(name);
                return Ok(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(DeleteUser));
                throw;
            }
        }

        #endregion

        #region Groups
        [Authorize(Roles = "Administrator,Supervisor")]
        [HttpGet, Route(nameof(Groups))]
        public async Task<IActionResult> Groups()
        {
            try
            {
                var groups = await _userGroupService.GetAllGroupsAsync();
                return Ok(groups);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(Groups));
                throw;
            }
        }

        [Authorize(Roles = "Supervisor")]
        [HttpPost(nameof(CreateGroupAsync))]
        [SwaggerOperation(Summary = "Create new group", Description = "Create a new group access.")]
        public async Task<IActionResult> CreateGroupAsync(UserGroups group)
        {
            if (group == null) throw new NullReferenceException("Data cannot be null");

            try
            {
                await _userGroupService.AddAsync(group);
                return Ok(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(CreateGroupAsync));
                throw;
            }
        }

        [Authorize(Roles = "Supervisor")]
        [HttpPut(nameof(UpdateGroupAsync))]
        [SwaggerOperation(Summary = "Update group data", Description = "update group data.")]
        public async Task<IActionResult> UpdateGroupAsync(UserGroups group)
        {
            if (group == null) throw new NullReferenceException("Data cannot be null");
            try
            {
                await _userGroupService.UpdateAsync(group);
                return Ok(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(UpdateGroupAsync));
                throw;
            }
        }

        [Authorize(Roles = "Supervisor")]
        [HttpDelete(nameof(DeleteGroupAsync))]
        [SwaggerOperation(Summary = "Delete group by name", Description = "Delete group by Name.")]
        public async Task<IActionResult> DeleteGroupAsync(string name)
        {
            try
            {
                await _userGroupService.DeleteAsync(name);
                return Ok(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(DeleteGroupAsync));
                throw;
            }
        }

        #endregion

        #region Permissions

        [Authorize(Roles = "Supervisor")]
        [HttpGet, Route("permissions")]
        public async Task<IActionResult> Permissions()
        {
            try
            {
                var permissions = await _userPermissionService.GetAllPermissionsAsync();
                return Ok(permissions);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(Permissions));
                throw;
            }
        }

        [Authorize(Roles = "Supervisor")]
        [HttpPost(nameof(CreatePermissionAsync))]
        [SwaggerOperation(Summary = "Create new permission", Description = "Create a new permission access.")]
        public async Task<IActionResult> CreatePermissionAsync(UserPermissions permission)
        {
            if (permission == null) throw new NullReferenceException("Data cannot be null");
            try
            {
                await _userPermissionService.AddAsync(permission);
                return Ok(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(CreatePermissionAsync));
                throw;
            }
        }

        [Authorize(Roles = "Supervisor")]
        [HttpPut(nameof(UpdatePermissionAsync))]
        [SwaggerOperation(Summary = "Update permission data", Description = "update permission data.")]
        public async Task<IActionResult> UpdatePermissionAsync(UserPermissions permission)
        {
            if (permission == null) throw new NullReferenceException("Data cannot be null");
            try
            {
                await _userPermissionService.UpdateAsync(permission);
                return Ok(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(UpdatePermissionAsync));
                throw;
            }
        }

        [Authorize(Roles = "Supervisor")]
        [HttpDelete(nameof(DeletePermissionAsync))]
        [SwaggerOperation(Summary = "Delete permission by name", Description = "Delete permission by Name.")]
        public async Task<IActionResult> DeletePermissionAsync(string name)
        {
            try
            {
                await _userPermissionService.DeleteAsync(name);
                return Ok(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, nameof(DeletePermissionAsync));
                throw;
            }
        }

        #endregion
    }
}
