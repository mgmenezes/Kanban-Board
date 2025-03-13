namespace KanbanBoard.Core.Services;

using KanbanBoard.Core.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ICardService
{
    Task<IEnumerable<Card>> GetCardsByListIdAsync(Guid listId);
    Task<IEnumerable<Card>> GetCardsByAssigneeIdAsync(Guid userId);
    Task<Card?> GetCardByIdAsync(Guid cardId);
    Task<Card?> GetCardDetailsAsync(Guid cardId);
    Task<Card> CreateCardAsync(Card card);
    Task UpdateCardAsync(Card card);
    Task DeleteCardAsync(Guid cardId);
    Task MoveCardAsync(Guid cardId, Guid targetListId, int position);
    Task ReorderCardsAsync(Guid listId, Dictionary<Guid, int> cardPositions);
    Task AssignCardAsync(Guid cardId, Guid? userId);
}
