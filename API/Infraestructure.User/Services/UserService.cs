using Infraestructure.General.SystemGeneral.Model;
using Infraestructure.User.Model;
using Infraestructure.User.Services.Interface;
using Microsoft.AspNetCore.Identity;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Infraestructure.User.Services
{
    public class UserService : IUserService
    {
        private readonly Configurations _general;
        private readonly string _filePath;

        // Thread safety
        private static readonly SemaphoreSlim _semaphore = new(1, 1);

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            WriteIndented = true
        };

        private static IEnumerable<Users>? _users;

        public static IEnumerable<Users>? Users
        {
            get => _users;
            //set => _users = value;
        }

        public UserService(Configurations general)
        {
            _general = general;

            string basePath = AppContext.BaseDirectory; // ou Directory.GetCurrentDirectory()
            string configPath = _general.UserFolder!.UserPath;

            _filePath = configPath.StartsWith("./") || configPath.StartsWith(".\\")
                    ? Path.Combine(basePath, configPath.TrimStart('.', '/', '\\'))
                    : configPath;

            // Verifica se o arquivo existe, se não, cria um novo
            if (!File.Exists(_filePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_filePath) ?? string.Empty);
                File.WriteAllText(_filePath, "[]");
            }

        }

        public async Task<IEnumerable<Users>> GetAllUsersAsync()
        {
            if (Users == null || !Users.Any())
            {
                _ = await GetAllAsync();
                return Users!.Where(x => x.Enabled);
            }
            else
                return Users.Where(x => x.Enabled);
        }

        private async Task<IEnumerable<Users>> GetAllAsync()
        {
            await _semaphore.WaitAsync();
            try
            {
                if (!File.Exists(_filePath)) return [];

                var json = await File.ReadAllTextAsync(_filePath);

                _users = JsonSerializer.Deserialize<IEnumerable<Users>>(json)?.ToList() ?? [];
                return Users;
            }
            catch (Exception ex)
            {
                // Logar exceção se necessário
                Console.WriteLine($"Erro ao ler arquivo JSON: {ex.Message}");
                return [];
            }
            finally
            {
                _semaphore.Release();
            }
        }

        public async Task<Users?> GetByNameAsync(string name)
        {
            try
            {
                _ = await GetAllUsersAsync();
                return Users?.FirstOrDefault(u => u.Name == name);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar usuário: {ex.Message}");
                return null;
            }
        }

        public async Task AddAsync(Users user)
        {
            try
            {
                IEnumerable<Users> users = await GetAllAsync();

                bool existName = users.Any(u => u.Name == user.Name && u.Enabled);
                if (existName) throw new DuplicateNameException("This name already exists. It cannot be duplicated.");

                user.Password = new PasswordHasher<Users>().HashPassword(user, user.Password);

                IEnumerable<Users> newListUsers = users.Concat([user]);
                await SaveAllAsync(newListUsers);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao adicionar usuário: {ex.Message}");
            }
        }

        public async Task UpdateAsync(Users user)
        {
            try
            {
                var users = (await GetAllAsync()).ToList();
                var index = users.FindIndex(u => u.Name == user.Name && u.Enabled);
                if (index != -1)
                {
                    users[index] = user;
                    await SaveAllAsync(users);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao atualizar usuário: {ex.Message}");
            }
        }

        public async Task DeleteAsync(string name)
        {
            try
            {
                var users = (await GetAllAsync()).ToList();
                users.Where(u => u.Name == name && u.Enabled).ToList().ForEach(x => x.Enabled = false);
                //users.RemoveAll(u => u.Name == name);
                await SaveAllAsync(users);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao excluir usuário: {ex.Message}");
            }
        }

        private async Task SaveAllAsync(IEnumerable<Users> users)
        {
            await _semaphore.WaitAsync();
            try
            {
                var json = JsonSerializer.Serialize(users, _jsonOptions);
                await File.WriteAllTextAsync(_filePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao salvar arquivo JSON: {ex.Message}");
            }
            finally
            {
                _semaphore.Release();
                // Update 'Users' property
                _ = await GetAllAsync();
            }
        }

        public async Task ChangePasswordAsync(ChangePassword changePassword)
        {
            try
            {
                var users = (await GetAllAsync()).ToList();
                var index = users.FindIndex(u => u.Name == changePassword.Name && u.Enabled);
                if (index != -1)
                {
                    //users[index].Password = EncryptPassword(changePassword.NewPassword);
                    await SaveAllAsync(users);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao atualizar usuário: {ex.Message}");
            }
        }

        private static string EncryptPassword(string password)
        {
            byte[] bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            StringBuilder builder = new();
            for (int i = 0; i < bytes.Length; i++)
            {
                _ = builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
    }
}
