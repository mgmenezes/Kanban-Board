namespace KanbanBoard.Core.Services;

using KanbanBoard.Core.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ILabelService
{
    Task<IEnumerable<Label>> GetAllLabelsAsync();
    Task<Label?> GetLabelByIdAsync(Guid labelId);
    Task<IEnumerable<Label>> GetLabelsByCardIdAsync(Guid cardId);
    Task<Label> CreateLabelAsync(Label label);
    Task UpdateLabelAsync(Label label);
    Task DeleteLabelAsync(Guid labelId);
    Task AddLabelToCardAsync(Guid labelId, Guid cardId);
    Task RemoveLabelFromCardAsync(Guid labelId, Guid cardId);
}