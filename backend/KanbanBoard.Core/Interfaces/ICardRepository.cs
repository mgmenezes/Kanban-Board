namespace KanbanBoard.Core.Interfaces;

using KanbanBoard.Core.Entities;

public interface ICardRepository : IRepository<Card>
{
    Task<IEnumerable<Card>> GetCardsByListIdAsync(Guid listId);
    Task<IEnumerable<Card>> GetCardsByAssigneeIdAsync(Guid userId);
    Task<Card?> GetCardWithLabelsAsync(Guid cardId);
    Task MoveCardAsync(Guid cardId, Guid targetListId, int position);
    Task ReorderCardsAsync(Guid listId, Dictionary<Guid, int> cardPositions);
}