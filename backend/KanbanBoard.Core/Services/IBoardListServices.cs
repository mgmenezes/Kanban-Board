namespace KanbanBoard.Core.Services;

using KanbanBoard.Core.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IBoardListService
{
    Task<IEnumerable<BoardList>> GetListsByBoardIdAsync(Guid boardId);
    Task<BoardList?> GetListByIdAsync(Guid listId);
    Task<BoardList?> GetListWithCardsAsync(Guid listId);
    Task<BoardList> CreateListAsync(BoardList list);
    Task UpdateListAsync(BoardList list);
    Task DeleteListAsync(Guid listId);
    Task ReorderListsAsync(Guid boardId, Dictionary<Guid, int> listPositions);
}