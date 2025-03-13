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
public class BoardsController : ControllerBase
{
    private readonly IBoardService _boardService;

    public BoardsController(IBoardService boardService)
    {
        _boardService = boardService;
    }

    // GET: api/boards
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BoardDto>>> GetBoards()
    {
        var userId = GetCurrentUserId();
        var boards = await _boardService.GetUserBoardsAsync(userId);

        return Ok(boards.Select(MapToDto));
    }

    // GET: api/boards/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<BoardDetailDto>> GetBoard(Guid id)
    {
        var userId = GetCurrentUserId();
        var board = await _boardService.GetBoardDetailsAsync(id);

        if (board == null)
        {
            return NotFound();
        }

        if (board.OwnerId != userId)
        {
            return Forbid();
        }

        return Ok(MapToDetailDto(board));
    }

    // POST: api/boards
    [HttpPost]
    public async Task<ActionResult<BoardDto>> CreateBoard(BoardCreateDto boardDto)
    {
        var userId = GetCurrentUserId();

        var board = new Board
        {
            Title = boardDto.Title,
            Description = boardDto.Description,
            OwnerId = userId
        };

        var createdBoard = await _boardService.CreateBoardAsync(board);

        return CreatedAtAction(nameof(GetBoard), new { id = createdBoard.Id }, MapToDto(createdBoard));
    }

    // PUT: api/boards/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBoard(Guid id, BoardUpdateDto boardDto)
    {
        var userId = GetCurrentUserId();
        var board = await _boardService.GetBoardByIdAsync(id);

        if (board == null)
        {
            return NotFound();
        }

        if (board.OwnerId != userId)
        {
            return Forbid();
        }

        board.Title = boardDto.Title;
        board.Description = boardDto.Description;

        await _boardService.UpdateBoardAsync(board);

        return NoContent();
    }

    // DELETE: api/boards/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBoard(Guid id)
    {
        var userId = GetCurrentUserId();
        var board = await _boardService.GetBoardByIdAsync(id);

        if (board == null)
        {
            return NotFound();
        }

        if (board.OwnerId != userId)
        {
            return Forbid();
        }

        await _boardService.DeleteBoardAsync(id);

        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : Guid.Empty;
    }

    private static BoardDto MapToDto(Board board)
    {
        return new BoardDto
        {
            Id = board.Id,
            Title = board.Title,
            Description = board.Description,
            OwnerId = board.OwnerId
        };
    }

    private static BoardDetailDto MapToDetailDto(Board board)
    {
        return new BoardDetailDto
        {
            Id = board.Id,
            Title = board.Title,
            Description = board.Description,
            OwnerId = board.OwnerId,
            Lists = board.Lists.Select(list => new BoardListDto
            {
                Id = list.Id,
                Title = list.Title,
                Position = list.Position,
                BoardId = list.BoardId
            }).ToList()
        };
    }
}