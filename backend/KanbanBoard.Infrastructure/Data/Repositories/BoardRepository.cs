namespace KanbanBoard.Infrastructure.Data.Repositories;

using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class BoardRepository : Repository<Board>, IBoardRepository
{
    public BoardRepository(KanbanDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Board>> GetBoardsByUserIdAsync(Guid userId)
    {
        return await _dbSet
            .Where(b => b.OwnerId == userId)
            .ToListAsync();
    }

    public async Task<Board?> GetBoardWithListsAsync(Guid boardId)
    {
        return await _dbSet
            .Include(b => b.Lists.OrderBy(l => l.Position))
            .FirstOrDefaultAsync(b => b.Id == boardId);
    }

    public async Task<Board?> GetBoardWithListsAndCardsAsync(Guid boardId)
    {
        return await _dbSet
            .Include(b => b.Lists.OrderBy(l => l.Position))
                .ThenInclude(l => l.Cards.OrderBy(c => c.Position))
                    .ThenInclude(c => c.Labels)
            .Include(b => b.Lists)
                .ThenInclude(l => l.Cards)
                    .ThenInclude(c => c.AssignedTo)
            .FirstOrDefaultAsync(b => b.Id == boardId);
    }
}
