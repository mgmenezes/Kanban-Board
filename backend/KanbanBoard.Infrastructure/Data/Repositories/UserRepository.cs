namespace KanbanBoard.Infrastructure.Data.Repositories;

using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(KanbanDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.UserName == username);
    }

    public async Task<User?> GetUserWithBoardsAsync(Guid userId)
    {
        return await _dbSet
            .Include(u => u.Boards)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<User?> GetUserWithAssignedCardsAsync(Guid userId)
    {
        return await _dbSet
            .Include(u => u.AssignedCards)
                .ThenInclude(c => c.BoardList)
                    .ThenInclude(l => l.Board)
            .Include(u => u.AssignedCards)
                .ThenInclude(c => c.Labels)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }
}