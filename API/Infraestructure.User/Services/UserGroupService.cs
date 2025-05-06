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
    public class UserGroupService : IUserGroupService
    {
        private readonly Configurations _general;
        private readonly string _filePath;

        private static readonly SemaphoreSlim _semaphore = new(1, 1);

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            WriteIndented = true
        };

        private IEnumerable<UserGroups> _groups;
        public IEnumerable<UserGroups> Groups
        {
            get => _groups;
            //set => _groups = value;
        }

        public UserGroupService(Configurations general)
        {
            _general = general;

            string basePath = AppContext.BaseDirectory; // ou Directory.GetCurrentDirectory()
            string configPath = _general.UserFolder!.UserGroupPath;

            _filePath = configPath.StartsWith("./") || configPath.StartsWith(".\\")
                    ? Path.Combine(basePath, configPath.TrimStart('.', '/', '\\'))
                    : configPath;

            // Verifica se o arquivo existe, se não, cria um novo
            if (!File.Exists(_filePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_filePath) ?? string.Empty);
                File.WriteAllText(_filePath, "[]");
            }

            // Inicializa a lista de grupos
            _groups = [];
        }

        public async Task<IEnumerable<UserGroups>> GetAllGroupsAsync()
        {
            if (Groups == null || !Groups.Any())
            {
                await GetAllAsync();
                return Groups!;
            }
            else
                return Groups;
        }

        private async Task<IEnumerable<UserGroups>> GetAllAsync()
        {
            await _semaphore.WaitAsync();
            try
            {
                if (!File.Exists(_filePath)) return [];

                var json = await File.ReadAllTextAsync(_filePath);

                _groups = JsonSerializer.Deserialize<IEnumerable<UserGroups>>(json)?.ToList() ?? [];
                return Groups;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao ler grupos: {ex.Message}");
                return [];
            }
            finally
            {
                _semaphore.Release();
            }
        }

        public async Task<UserGroups?> GetByNameAsync(string name)
        {
            try
            {
                _ = await GetAllGroupsAsync();
                return Groups.FirstOrDefault(x => x.Name == name && x.Enabled);

                //var groups = await GetAllAsync();
                //return groups.FirstOrDefault(g => g.Name == name);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar grupo: {ex.Message}");
                return null;
            }
        }

        public async Task AddAsync(UserGroups group)
        {
            try
            {
                var groups = await GetAllAsync();
                var newListGroups = groups.Concat([group]);
                await SaveAllAsync(newListGroups);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao adicionar grupo: {ex.Message}");
            }
        }

        public async Task UpdateAsync(UserGroups group)
        {
            try
            {
                var groups = (await GetAllAsync()).ToList();
                var index = groups.FindIndex(g => g.Name == group.Name && g.Enabled);
                if (index != -1)
                {
                    groups[index] = group;
                    await SaveAllAsync(groups);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao atualizar grupo: {ex.Message}");
            }
        }

        public async Task DeleteAsync(string name)
        {
            try
            {
                List<UserGroups>? groups = [.. await GetAllAsync()];
                groups.RemoveAll(p => p.Name == name && p.Enabled);
                await SaveAllAsync(groups);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao deletar grupo: {ex.Message}");
            }

        }

        private async Task SaveAllAsync(IEnumerable<UserGroups> groups)
        {
            await _semaphore.WaitAsync();
            try
            {
                var json = JsonSerializer.Serialize(groups, _jsonOptions);
                await File.WriteAllTextAsync(_filePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao salvar grupos: {ex.Message}");
            }
            finally
            {
                _semaphore.Release();
                // Update 'Groups' property
                _ = await GetAllAsync();
            }
        }
    }
}
