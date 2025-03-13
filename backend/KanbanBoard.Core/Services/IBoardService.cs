namespace KanbanBoard.Core.Services;

using KanbanBoard.Core.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IBoardService
{
    Task<IEnumerable<Board>> GetUserBoardsAsync(Guid userId);
    Task<Board?> GetBoardByIdAsync(Guid boardId);
    Task<Board?> GetBoardDetailsAsync(Guid boardId);
    Task<Board> CreateBoardAsync(Board board);
    Task UpdateBoardAsync(Board board);
    Task DeleteBoardAsync(Guid boardId);
}