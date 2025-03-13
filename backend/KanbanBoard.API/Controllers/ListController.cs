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
public class ListsController : ControllerBase
{
    private readonly IBoardListService _listService;
    private readonly IBoardService _boardService;

    public ListsController(IBoardListService listService, IBoardService boardService)
    {
        _listService = listService;
        _boardService = boardService;
    }

    // GET: api/lists/{boardId}/board
    [HttpGet("{boardId}/board")]
    public async Task<ActionResult<IEnumerable<BoardListDto>>> GetListsByBoard(Guid boardId)
    {
        var userId = GetCurrentUserId();
        var board = await _boardService.GetBoardByIdAsync(boardId);

        if (board == null)
        {
            return NotFound();
        }

        if (board.OwnerId != userId)
        {
            return Forbid();
        }

        var lists = await _listService.GetListsByBoardIdAsync(boardId);

        return Ok(lists.Select(MapToDto));
    }

    // GET: api/lists/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<BoardListDetailDto>> GetList(Guid id)
    {
        var userId = GetCurrentUserId();
        var list = await _listService.GetListWithCardsAsync(id);

        if (list == null)
        {
            return NotFound();
        }

        var board = await _boardService.GetBoardByIdAsync(list.BoardId);
        if (board == null || board.OwnerId != userId)
        {
            return Forbid();
        }

        return Ok(MapToDetailDto(list));
    }

    // POST: api/lists
    [HttpPost]
    public async Task<ActionResult<BoardListDto>> CreateList(BoardListCreateDto listDto)
    {
        var userId = GetCurrentUserId();
        var board = await _boardService.GetBoardByIdAsync(listDto.BoardId);

        if (board == null)
        {
            return NotFound();
        }

        if (board.OwnerId != userId)
        {
            return Forbid();
        }

        var list = new BoardList
        {
            Title = listDto.Title,
            BoardId = listDto.BoardId
        };

        var createdList = await _listService.CreateListAsync(list);

        return CreatedAtAction(nameof(GetList), new { id = createdList.Id }, MapToDto(createdList));
    }

    // PUT: api/lists/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateList(Guid id, BoardListUpdateDto listDto)
    {
        var userId = GetCurrentUserId();
        var list = await _listService.GetListByIdAsync(id);

        if (list == null)
        {
            return NotFound();
        }

        var board = await _boardService.GetBoardByIdAsync(list.BoardId);
        if (board == null || board.OwnerId != userId)
        {
            return Forbid();
        }

        list.Title = listDto.Title;

        await _listService.UpdateListAsync(list);

        return NoContent();
    }

    // DELETE: api/lists/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteList(Guid id)
    {
        var userId = GetCurrentUserId();
        var list = await _listService.GetListByIdAsync(id);

        if (list == null)
        {
            return NotFound();
        }

        var board = await _boardService.GetBoardByIdAsync(list.BoardId);
        if (board == null || board.OwnerId != userId)
        {
            return Forbid();
        }

        await _listService.DeleteListAsync(id);

        return NoContent();
    }

    // PATCH: api/lists/reorder
    [HttpPatch("reorder")]
    public async Task<IActionResult> ReorderLists(BoardListReorderDto reorderDto)
    {
        var userId = GetCurrentUserId();
        var board = await _boardService.GetBoardByIdAsync(reorderDto.BoardId);

        if (board == null)
        {
            return NotFound();
        }

        if (board.OwnerId != userId)
        {
            return Forbid();
        }

        await _listService.ReorderListsAsync(reorderDto.BoardId, reorderDto.ListPositions);

        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : Guid.Empty;
    }

    private static BoardListDto MapToDto(BoardList list)
    {
        return new BoardListDto
        {
            Id = list.Id,
            Title = list.Title,
            Position = list.Position,
            BoardId = list.BoardId
        };
    }

    private static BoardListDetailDto MapToDetailDto(BoardList list)
    {
        return new BoardListDetailDto
        {
            Id = list.Id,
            Title = list.Title,
            Position = list.Position,
            BoardId = list.BoardId,
            Cards = list.Cards.Select(card => new CardDto
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
                Labels = card.Labels.Select(label => new LabelDto
                {
                    Id = label.Id,
                    Name = label.Name,
                    Color = label.Color
                }).ToList()
            }).ToList()
        };
    }
}