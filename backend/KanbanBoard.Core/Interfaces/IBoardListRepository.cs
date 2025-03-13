namespace KanbanBoard.Core.Interfaces;

using KanbanBoard.Core.Entities;

public interface IBoardListRepository : IRepository<BoardList>
{
    Task<IEnumerable<BoardList>> GetListsByBoardIdAsync(Guid boardId);
    Task<BoardList?> GetListWithCardsAsync(Guid listId);
    Task ReorderListsAsync(Guid boardId, Dictionary<Guid, int> listPositions);
}