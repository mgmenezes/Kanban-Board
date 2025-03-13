namespace KanbanBoard.Core.Services;

using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class BoardService : IBoardService
{
    private readonly IBoardRepository _boardRepository;

    public BoardService(IBoardRepository boardRepository)
    {
        _boardRepository = boardRepository;
    }

    public async Task<IEnumerable<Board>> GetUserBoardsAsync(Guid userId)
    {
        return await _boardRepository.GetBoardsByUserIdAsync(userId);
    }

    public async Task<Board?> GetBoardByIdAsync(Guid boardId)
    {
        return await _boardRepository.GetByIdAsync(boardId);
    }

    public async Task<Board?> GetBoardDetailsAsync(Guid boardId)
    {
        return await _boardRepository.GetBoardWithListsAndCardsAsync(boardId);
    }

    public async Task<Board> CreateBoardAsync(Board board)
    {
        await _boardRepository.AddAsync(board);
        await _boardRepository.SaveChangesAsync();
        return board;
    }

    public async Task UpdateBoardAsync(Board board)
    {
        await _boardRepository.UpdateAsync(board);
        await _boardRepository.SaveChangesAsync();
    }

    public async Task DeleteBoardAsync(Guid boardId)
    {
        var board = await _boardRepository.GetByIdAsync(boardId);
        if (board != null)
        {
            await _boardRepository.DeleteAsync(board);
            await _boardRepository.SaveChangesAsync();
        }
    }
}