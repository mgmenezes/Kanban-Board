namespace KanbanBoard.API.Controllers;

using KanbanBoard.API.DTOs;
using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LabelsController : ControllerBase
{
    private readonly ILabelService _labelService;
    private readonly ICardService _cardService;
    private readonly IBoardListService _listService;
    private readonly IBoardService _boardService;

    public LabelsController(
        ILabelService labelService,
        ICardService cardService,
        IBoardListService listService,
        IBoardService boardService)
    {
        _labelService = labelService;
        _cardService = cardService;
        _listService = listService;
        _boardService = boardService;
    }

    // GET: api/labels
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LabelDto>>> GetLabels()
    {
        var labels = await _labelService.GetAllLabelsAsync();

        return Ok(labels.Select(MapToDto));
    }

    // GET: api/labels/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<LabelDto>> GetLabel(Guid id)
    {
        var label = await _labelService.GetLabelByIdAsync(id);

        if (label == null)
        {
            return NotFound();
        }

        return Ok(MapToDto(label));
    }

    // GET: api/labels/card/{cardId}
    [HttpGet("card/{cardId}")]
    public async Task<ActionResult<IEnumerable<LabelDto>>> GetLabelsByCard(Guid cardId)
    {
        var card = await _cardService.GetCardByIdAsync(cardId);
        if (card == null)
        {
            return NotFound();
        }

        var labels = await _labelService.GetLabelsByCardIdAsync(cardId);

        return Ok(labels.Select(MapToDto));
    }

    // POST: api/labels
    [HttpPost]
    public async Task<ActionResult<LabelDto>> CreateLabel(LabelCreateDto labelDto)
    {
        var label = new Label
        {
            Name = labelDto.Name,
            Color = labelDto.Color
        };

        var createdLabel = await _labelService.CreateLabelAsync(label);

        return CreatedAtAction(nameof(GetLabel), new { id = createdLabel.Id }, MapToDto(createdLabel));
    }

    // PUT: api/labels/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLabel(Guid id, LabelUpdateDto labelDto)
    {
        var label = await _labelService.GetLabelByIdAsync(id);

        if (label == null)
        {
            return NotFound();
        }

        label.Name = labelDto.Name;
        label.Color = labelDto.Color;

        await _labelService.UpdateLabelAsync(label);

        return NoContent();
    }

    // DELETE: api/labels/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLabel(Guid id)
    {
        var label = await _labelService.GetLabelByIdAsync(id);

        if (label == null)
        {
            return NotFound();
        }

        await _labelService.DeleteLabelAsync(id);

        return NoContent();
    }

    // POST: api/labels/card
    [HttpPost("card")]
    public async Task<IActionResult> AddLabelToCard(CardLabelDto labelCardDto)
    {
        var card = await _cardService.GetCardByIdAsync(labelCardDto.CardId);
        if (card == null)
        {
            return NotFound("Card not found");
        }

        var label = await _labelService.GetLabelByIdAsync(labelCardDto.LabelId);
        if (label == null)
        {
            return NotFound("Label not found");
        }

        await _labelService.AddLabelToCardAsync(labelCardDto.LabelId, labelCardDto.CardId);

        return NoContent();
    }

    // DELETE: api/labels/card
    [HttpDelete("card")]
    public async Task<IActionResult> RemoveLabelFromCard(CardLabelDto labelCardDto)
    {
        var card = await _cardService.GetCardByIdAsync(labelCardDto.CardId);
        if (card == null)
        {
            return NotFound("Card not found");
        }

        var label = await _labelService.GetLabelByIdAsync(labelCardDto.LabelId);
        if (label == null)
        {
            return NotFound("Label not found");
        }

        await _labelService.RemoveLabelFromCardAsync(labelCardDto.LabelId, labelCardDto.CardId);

        return NoContent();
    }

    private static LabelDto MapToDto(Label label)
    {
        return new LabelDto
        {
            Id = label.Id,
            Name = label.Name,
            Color = label.Color
        };
    }
}