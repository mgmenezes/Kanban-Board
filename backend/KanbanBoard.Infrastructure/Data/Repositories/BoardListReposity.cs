namespace KanbanBoard.Infrastructure.Data.Repositories;

using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class BoardListRepository : Repository<BoardList>, IBoardListRepository
{
    public BoardListRepository(KanbanDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<BoardList>> GetListsByBoardIdAsync(Guid boardId)
    {
        return await _dbSet
            .Where(l => l.BoardId == boardId)
            .OrderBy(l => l.Position)
            .ToListAsync();
    }

    public async Task<BoardList?> GetListWithCardsAsync(Guid listId)
    {
        return await _dbSet
            .Include(l => l.Cards.OrderBy(c => c.Position))
                .ThenInclude(c => c.Labels)
            .Include(l => l.Cards)
                .ThenInclude(c => c.AssignedTo)
            .FirstOrDefaultAsync(l => l.Id == listId);
    }

    public async Task ReorderListsAsync(Guid boardId, Dictionary<Guid, int> listPositions)
    {
        foreach (var (listId, position) in listPositions)
        {
            var list = await _dbSet.FindAsync(listId);
            if (list != null && list.BoardId == boardId)
            {
                list.Position = position;
                _context.Entry(list).State = EntityState.Modified;
            }
        }

        await _context.SaveChangesAsync();
    }
}