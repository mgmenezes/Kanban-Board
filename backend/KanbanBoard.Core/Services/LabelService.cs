namespace KanbanBoard.Core.Services;

using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class LabelService : ILabelService
{
    private readonly ILabelRepository _labelRepository;

    public LabelService(ILabelRepository labelRepository)
    {
        _labelRepository = labelRepository;
    }

    public async Task<IEnumerable<Label>> GetAllLabelsAsync()
    {
        return await _labelRepository.GetAllAsync();
    }

    public async Task<Label?> GetLabelByIdAsync(Guid labelId)
    {
        return await _labelRepository.GetByIdAsync(labelId);
    }

    public async Task<IEnumerable<Label>> GetLabelsByCardIdAsync(Guid cardId)
    {
        return await _labelRepository.GetLabelsByCardIdAsync(cardId);
    }

    public async Task<Label> CreateLabelAsync(Label label)
    {
        await _labelRepository.AddAsync(label);
        await _labelRepository.SaveChangesAsync();
        return label;
    }

    public async Task UpdateLabelAsync(Label label)
    {
        await _labelRepository.UpdateAsync(label);
        await _labelRepository.SaveChangesAsync();
    }

    public async Task DeleteLabelAsync(Guid labelId)
    {
        var label = await _labelRepository.GetByIdAsync(labelId);
        if (label != null)
        {
            await _labelRepository.DeleteAsync(label);
            await _labelRepository.SaveChangesAsync();
        }
    }

    public async Task AddLabelToCardAsync(Guid labelId, Guid cardId)
    {
        await _labelRepository.AddLabelToCardAsync(labelId, cardId);
    }

    public async Task RemoveLabelFromCardAsync(Guid labelId, Guid cardId)
    {
        await _labelRepository.RemoveLabelFromCardAsync(labelId, cardId);
    }
}