namespace KanbanBoard.Infrastructure.Data.Repositories;

using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class CardRepository : Repository<Card>, ICardRepository
{
    public CardRepository(KanbanDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Card>> GetCardsByListIdAsync(Guid listId)
    {
        return await _context.Cards
            .Where(c => c.BoardListId == listId)
            .OrderBy(c => c.Position)
            .Include(c => c.Labels)
            .Include(c => c.AssignedTo)
            .ToListAsync();
    }

    public async Task<IEnumerable<Card>> GetCardsByAssigneeIdAsync(Guid userId)
    {
        return await _context.Cards
            .Where(c => c.AssignedToId == userId)
            .Include(c => c.BoardList)
                .ThenInclude(l => l.Board)
            .Include(c => c.Labels)
            .ToListAsync();
    }

    public async Task<Card?> GetCardWithLabelsAsync(Guid cardId)
    {
        return await _context.Cards
            .Include(c => c.Labels)
            .Include(c => c.AssignedTo)
            .FirstOrDefaultAsync(c => c.Id == cardId);
    }

    public async Task MoveCardAsync(Guid cardId, Guid targetListId, int position)
    {
        // Obtém o card a ser movido
        var card = await _context.Cards.FindAsync(cardId);
        if (card == null) return;

        // Armazena a lista e posição de origem
        var sourceListId = card.BoardListId;
        var sourcePosition = card.Position;

        // Atualiza a lista e posição do card
        card.BoardListId = targetListId;
        card.Position = position;
        _context.Entry(card).State = EntityState.Modified;

        // Reordena os cards na lista de destino para abrir espaço
        var cardsToShift = await _context.Cards
            .Where(c => c.BoardListId == targetListId && c.Position >= position && c.Id != cardId)
            .OrderBy(c => c.Position)
            .ToListAsync();

        foreach (var c in cardsToShift)
        {
            c.Position += 1;
            _context.Entry(c).State = EntityState.Modified;
        }

        // Reordena os cards na lista de origem para fechar o espaço
        if (sourceListId != targetListId)
        {
            var sourceCardsToShift = await _context.Cards
                .Where(c => c.BoardListId == sourceListId && c.Position > sourcePosition)
                .OrderBy(c => c.Position)
                .ToListAsync();

            foreach (var c in sourceCardsToShift)
            {
                c.Position -= 1;
                _context.Entry(c).State = EntityState.Modified;
            }
        }

        await _context.SaveChangesAsync();
    }

    public async Task ReorderCardsAsync(Guid listId, Dictionary<Guid, int> cardPositions)
    {
        foreach (var (cardId, position) in cardPositions)
        {
            var card = await _context.Cards.FindAsync(cardId);
            if (card != null && card.BoardListId == listId)
            {
                card.Position = position;
                _context.Entry(card).State = EntityState.Modified;
            }
        }

        await _context.SaveChangesAsync();
    }
}