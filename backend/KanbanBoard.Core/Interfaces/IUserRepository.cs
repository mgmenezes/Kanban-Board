namespace KanbanBoard.Core.Interfaces;

using KanbanBoard.Core.Entities;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetUserWithBoardsAsync(Guid userId);
    Task<User?> GetUserWithAssignedCardsAsync(Guid userId);
}