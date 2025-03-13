namespace KanbanBoard.Core.Services;

using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class CardService : ICardService
{
    private readonly ICardRepository _cardRepository;
    private readonly IBoardListRepository _listRepository;

    public CardService(ICardRepository cardRepository, IBoardListRepository listRepository)
    {
        _cardRepository = cardRepository;
        _listRepository = listRepository;
    }

    public async Task<IEnumerable<Card>> GetCardsByListIdAsync(Guid listId)
    {
        return await _cardRepository.GetCardsByListIdAsync(listId);
    }

    public async Task<IEnumerable<Card>> GetCardsByAssigneeIdAsync(Guid userId)
    {
        return await _cardRepository.GetCardsByAssigneeIdAsync(userId);
    }

    public async Task<Card?> GetCardByIdAsync(Guid cardId)
    {
        return await _cardRepository.GetByIdAsync(cardId);
    }

    public async Task<Card?> GetCardDetailsAsync(Guid cardId)
    {
        return await _cardRepository.GetCardWithLabelsAsync(cardId);
    }

    public async Task<Card> CreateCardAsync(Card card)
    {
        // Verificar se a lista existe
        var list = await _listRepository.GetByIdAsync(card.BoardListId);
        if (list == null)
        {
            throw new ArgumentException($"List with ID {card.BoardListId} does not exist.");
        }

        // Obter a posição mais alta atual e incrementar
        var cards = await _cardRepository.GetCardsByListIdAsync(card.BoardListId);
        card.Position = cards.Any() ? cards.Max(c => c.Position) + 1 : 0;

        await _cardRepository.AddAsync(card);
        await _cardRepository.SaveChangesAsync();
        return card;
    }

    public async Task UpdateCardAsync(Card card)
    {
        await _cardRepository.UpdateAsync(card);
        await _cardRepository.SaveChangesAsync();
    }

    public async Task DeleteCardAsync(Guid cardId)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        if (card != null)
        {
            await _cardRepository.DeleteAsync(card);
            await _cardRepository.SaveChangesAsync();
        }
    }

    public async Task MoveCardAsync(Guid cardId, Guid targetListId, int position)
    {
        await _cardRepository.MoveCardAsync(cardId, targetListId, position);
    }

    public async Task ReorderCardsAsync(Guid listId, Dictionary<Guid, int> cardPositions)
    {
        await _cardRepository.ReorderCardsAsync(listId, cardPositions);
    }

    public async Task AssignCardAsync(Guid cardId, Guid? userId)
    {
        var card = await _cardRepository.GetByIdAsync(cardId);
        if (card != null)
        {
            card.AssignedToId = userId;
            await _cardRepository.UpdateAsync(card);
            await _cardRepository.SaveChangesAsync();
        }
    }
}