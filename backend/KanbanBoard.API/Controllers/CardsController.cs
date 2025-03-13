namespace KanbanBoard.API.Controllers;

using KanbanBoard.API.DTOs;
using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CardsController : ControllerBase
{
    private readonly ICardService _cardService;
    private readonly IBoardListService _listService;
    private readonly IBoardService _boardService;

    public CardsController(ICardService cardService, IBoardListService listService, IBoardService boardService)
    {
        _cardService = cardService;
        _listService = listService;
        _boardService = boardService;
    }

    // GET: api/cards/{listId}/list
    [HttpGet("{listId}/list")]
    public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsByList(Guid listId)
    {
        var userId = GetCurrentUserId();
        var list = await _listService.GetListByIdAsync(listId);

        if (list == null)
        {
            return NotFound();
        }

        var board = await _boardService.GetBoardByIdAsync(list.BoardId);
        if (board == null || board.OwnerId != userId)
        {
            return Forbid();
        }

        var cards = await _cardService.GetCardsByListIdAsync(listId);

        return Ok(cards.Select(MapToDto));
    }

    // GET: api/cards/assigned
    [HttpGet("assigned")]
    public async Task<ActionResult<IEnumerable<CardDto>>> GetAssignedCards()
    {
        var userId = GetCurrentUserId();
        var cards = await _cardService.GetCardsByAssigneeIdAsync(userId);

        return Ok(cards.Select(MapToDto));
    }

    // GET: api/cards/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<CardDto>> GetCard(Guid id)
    {
        var userId = GetCurrentUserId();
        var card = await _cardService.GetCardDetailsAsync(id);

        if (card == null)
        {
            return NotFound();
        }

        var list = await _listService.GetListByIdAsync(card.BoardListId);
        if (list == null)
        {
            return NotFound();
        }

        var board = await _boardService.GetBoardByIdAsync(list.BoardId);
        if (board == null || board.OwnerId != userId)
        {
            return Forbid();
        }

        return Ok(MapToDto(card));
    }

    // POST: api/cards
    [HttpPost]
    public async Task<ActionResult<CardDto>> CreateCard(CardCreateDto cardDto)
    {
        var userId = GetCurrentUserId();
        var list = await _listService.GetListByIdAsync(cardDto.BoardListId);

        if (list == null)
        {
            return NotFound();
        }

        var board = await _boardService.GetBoardByIdAsync(list.BoardId);
        if (board == null || board.OwnerId != userId)
        {
            return Forbid();
        }

        var card = new Card
        {
            Title = cardDto.Title,
            Description = cardDto.Description,
            DueDate = cardDto.DueDate,
            Priority = Enum.Parse<CardPriority>(cardDto.Priority),
            BoardListId = cardDto.BoardListId,
            AssignedToId = cardDto.AssignedToId
        };

        var createdCard = await _cardService.CreateCardAsync(card);

        return CreatedAtAction(nameof(GetCard), new { id = createdCard.Id }, MapToDto(createdCard));
    }

    // PUT: api/cards/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCard(Guid id, CardUpdateDto cardDto)
    {
        var userId = GetCurrentUserId();
        var card = await _cardService.GetCardByIdAsync(id);

        if (card == null)
        {
            return NotFound();
        }

        var list = await _listService.GetListByIdAsync(card.BoardListId);
        if (list == null)
        {
            return NotFound();
        }

        var board = await _boardService.GetBoardByIdAsync(list.BoardId);
        if (board == null || board.OwnerId != userId)
        {
            return Forbid();
        }

        card.Title = cardDto.Title;
        card.Description = cardDto.Description;
        card.DueDate = cardDto.DueDate;

        if (Enum.TryParse<CardPriority>(cardDto.Priority, out var priority))
        {
            card.Priority = priority;
        }

        await _cardService.UpdateCardAsync(card);

        return NoContent();
    }

    // DELETE: api/cards/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCard(Guid id)
    {
        var userId = GetCurrentUserId();
        var card = await _cardService.GetCardByIdAsync(id);

        if (card == null)
        {
            return NotFound();
        }

        var list = await _listService.GetListByIdAsync(card.BoardListId);
        if (list == null)
        {
            return NotFound();
        }

        var board = await _boardService.GetBoardByIdAsync(list.BoardId);
        if (board == null || board.OwnerId != userId)
        {
            return Forbid();
        }

        await _cardService.DeleteCardAsync(id);

        return NoContent();
    }

    // PATCH: api/cards/move
    [HttpPatch("move")]
    public async Task<IActionResult> MoveCard(CardMoveDto moveDto)
    {
        var userId = GetCurrentUserId();
        var card = await _cardService.GetCardByIdAsync(moveDto.CardId);

        if (card == null)
        {
            return NotFound();
        }

        var sourceList = await _listService.GetListByIdAsync(card.BoardListId);
        var targetList = await _listService.GetListByIdAsync(moveDto.TargetListId);

        if (sourceList == null || targetList == null)
        {
            return NotFound();
        }

        var sourceBoard = await _boardService.GetBoardByIdAsync(sourceList.BoardId);
        var targetBoard = await _boardService.GetBoardByIdAsync(targetList.BoardId);

        if (sourceBoard == null || targetBoard == null ||
            sourceBoard.OwnerId != userId || targetBoard.OwnerId != userId)
        {
            return Forbid();
        }

        await _cardService.MoveCardAsync(moveDto.CardId, moveDto.TargetListId, moveDto.Position);

        return NoContent();
    }

    // PATCH: api/cards/reorder
    [HttpPatch("reorder")]
    public async Task<IActionResult> ReorderCards(CardReorderDto reorderDto)
    {
        var userId = GetCurrentUserId();
        var list = await _listService.GetListByIdAsync(reorderDto.ListId);

        if (list == null)
        {
            return NotFound();
        }

        var board = await _boardService.GetBoardByIdAsync(list.BoardId);
        if (board == null || board.OwnerId != userId)
        {
            return Forbid();
        }

        await _cardService.ReorderCardsAsync(reorderDto.ListId, reorderDto.CardPositions);

        return NoContent();
    }

    // PATCH: api/cards/assign
    [HttpPatch("assign")]
    public async Task<IActionResult> AssignCard(CardAssignDto assignDto)
    {
        var userId = GetCurrentUserId();
        var card = await _cardService.GetCardByIdAsync(assignDto.CardId);

        if (card == null)
        {
            return NotFound();
        }

        var list = await _listService.GetListByIdAsync(card.BoardListId);
        if (list == null)
        {
            return NotFound();
        }

        var board = await _boardService.GetBoardByIdAsync(list.BoardId);
        if (board == null || board.OwnerId != userId)
        {
            return Forbid();
        }

        await _cardService.AssignCardAsync(assignDto.CardId, assignDto.UserId);

        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : Guid.Empty;
    }

    private static CardDto MapToDto(Card card)
    {
        return new CardDto
        {
            Id = card.Id,
            Title = card.Title,
            Description = card.Description,
            Position = card.Position,
            DueDate = card.DueDate,
            Priority = card.Priority.ToString(),
            BoardListId = card.BoardListId,
            AssignedToId = card.AssignedToId,
            AssignedTo = card.AssignedTo != null ? new UserDto
            {
                Id = card.AssignedTo.Id,
                UserName = card.AssignedTo.UserName,
                Email = card.AssignedTo.Email
            } : null,
            Labels = card.Labels?.Select(label => new LabelDto
            {
                Id = label.Id,
                Name = label.Name,
                Color = label.Color
            }).ToList() ?? new List<LabelDto>()
        };
    }
}