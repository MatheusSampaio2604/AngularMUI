using Infraestructure.General.SystemGeneral.Model;
using Infraestructure.User.Model;
using Infraestructure.User.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infraestructure.User.Services
{
    public class UserPermissionService : IUserPermissionService
    {
        private readonly Configurations _general;
        private readonly string _filePath;

        private static readonly SemaphoreSlim _semaphore = new(1, 1);

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            WriteIndented = true
        };

        private IEnumerable<UserPermissions> _permissions;
        public IEnumerable<UserPermissions> Permissions
        {
            get => _permissions;
            //set => _permissions = value;
        }

        public UserPermissionService(Configurations general)
        {
            _general = general;

            string basePath = AppContext.BaseDirectory; // ou Directory.GetCurrentDirectory()
            string configPath = _general.UserFolder!.UserPermissionPath;

            _filePath = configPath.StartsWith("./") || configPath.StartsWith(".\\")
                    ? Path.Combine(basePath, configPath.TrimStart('.', '/', '\\'))
                    : configPath;

            // Verifica se o arquivo existe, se não, cria um novo
            if (!File.Exists(_filePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_filePath) ?? string.Empty);
                File.WriteAllText(_filePath, "[]");
            }

            _permissions = [];
        }

        public async Task<IEnumerable<UserPermissions>> GetAllPermissionsAsync()
        {
            if (Permissions == null || !Permissions.Any())
            {
                await GetAllAsync();
                return Permissions!;
            }
            else
                return Permissions;
        }

        private async Task<IEnumerable<UserPermissions>> GetAllAsync()
        {
            await _semaphore.WaitAsync();
            try
            {
                if (!File.Exists(_filePath)) return [];
                var json = await File.ReadAllTextAsync(_filePath);

                _permissions = JsonSerializer.Deserialize<List<UserPermissions>>(json)?.ToList() ?? [];
                return Permissions;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao ler permissões: {ex.Message}");
                return [];
            }
            finally
            {
                _semaphore.Release();
            }
        }

        public async Task<UserPermissions?> GetByNameAsync(string name)
        {
            try
            {
                _ = await GetAllPermissionsAsync();
                return Permissions.FirstOrDefault(p => p.Name == name && p.Enabled);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar permissão: {ex.Message}");
                return null;
            }
        }

        public async Task AddAsync(UserPermissions permission)
        {
            try
            {
                var permissions = await GetAllAsync();

                var newListPermissions = permissions.Concat([permission]);
                await SaveAllAsync(newListPermissions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao adicionar permissão: {ex.Message}");
            }
        }

        public async Task UpdateAsync(UserPermissions permission)
        {
            try
            {
                var permissions = (await GetAllAsync()).ToList();
                var index = permissions.FindIndex(p => p.Name == permission.Name && p.Enabled);
                if (index != -1)
                {
                    permissions[index] = permission;
                    await SaveAllAsync(permissions);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao atualizar permissão: {ex.Message}");
            }
        }

        public async Task DeleteAsync(string name)
        {
            try
            {
                List<UserPermissions>? permissions = [.. await GetAllAsync()];
                permissions.RemoveAll(p => p.Name == name && p.Enabled);
                await SaveAllAsync(permissions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao deletar permissão: {ex.Message}");
            }
        }

        private async Task SaveAllAsync(IEnumerable<UserPermissions> permissions)
        {
            await _semaphore.WaitAsync();
            try
            {
                var json = JsonSerializer.Serialize(permissions, _jsonOptions);
                await File.WriteAllTextAsync(_filePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao salvar permissões: {ex.Message}");
            }
            finally
            {
                _semaphore.Release();
                // Update 'Permissions' property
                _ = await GetAllAsync();
            }
        }
    }
}
