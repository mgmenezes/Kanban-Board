namespace KanbanBoard.Infrastructure.Data.Repositories;

using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class LabelRepository : Repository<Label>, ILabelRepository
{
    public LabelRepository(KanbanDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Label>> GetLabelsByCardIdAsync(Guid cardId)
    {
        var card = await _context.Cards
            .Include(c => c.Labels)
            .FirstOrDefaultAsync(c => c.Id == cardId);

        return card?.Labels ?? new List<Label>();
    }

    public async Task AddLabelToCardAsync(Guid labelId, Guid cardId)
    {
        var card = await _context.Cards
            .Include(c => c.Labels)
            .FirstOrDefaultAsync(c => c.Id == cardId);

        var label = await _context.Labels.FindAsync(labelId);

        if (card != null && label != null)
        {
            if (!card.Labels.Any(l => l.Id == labelId))
            {
                card.Labels.Add(label);
                await _context.SaveChangesAsync();
            }
        }
    }

    public async Task RemoveLabelFromCardAsync(Guid labelId, Guid cardId)
    {
        var card = await _context.Cards
            .Include(c => c.Labels)
            .FirstOrDefaultAsync(c => c.Id == cardId);

        var label = await _context.Labels.FindAsync(labelId);

        if (card != null && label != null)
        {
            var labelToRemove = card.Labels.FirstOrDefault(l => l.Id == labelId);
            if (labelToRemove != null)
            {
                card.Labels.Remove(labelToRemove);
                await _context.SaveChangesAsync();
            }
        }
    }
}