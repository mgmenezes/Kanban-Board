namespace KanbanBoard.Core.Interfaces;

using KanbanBoard.Core.Entities;

public interface IBoardRepository : IRepository<Board>
{
    Task<IEnumerable<Board>> GetBoardsByUserIdAsync(Guid userId);
    Task<Board?> GetBoardWithListsAsync(Guid boardId);
    Task<Board?> GetBoardWithListsAndCardsAsync(Guid boardId);
}
