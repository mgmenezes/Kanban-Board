namespace KanbanBoard.Core.Services;

using KanbanBoard.Core.Entities;
using System;
using System.Threading.Tasks;

public interface IAuthService
{
    Task<User> RegisterAsync(string username, string email, string password);
    Task<(User? User, string Token)> LoginAsync(string email, string password);
    Task<User?> GetUserByIdAsync(Guid userId);
}
