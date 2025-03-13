namespace KanbanBoard.Core.Interfaces;

using KanbanBoard.Core.Entities;

public interface ILabelRepository : IRepository<Label>
{
    Task<IEnumerable<Label>> GetLabelsByCardIdAsync(Guid cardId);
    Task AddLabelToCardAsync(Guid labelId, Guid cardId);
    Task RemoveLabelFromCardAsync(Guid labelId, Guid cardId);
}