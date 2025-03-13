namespace KanbanBoard.Core.Services;

using KanbanBoard.Core.Entities;
using KanbanBoard.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class BoardListService : IBoardListService
{
    private readonly IBoardListRepository _listRepository;
    private readonly IBoardRepository _boardRepository;

    public BoardListService(IBoardListRepository listRepository, IBoardRepository boardRepository)
    {
        _listRepository = listRepository;
        _boardRepository = boardRepository;
    }

    public async Task<IEnumerable<BoardList>> GetListsByBoardIdAsync(Guid boardId)
    {
        return await _listRepository.GetListsByBoardIdAsync(boardId);
    }

    public async Task<BoardList?> GetListByIdAsync(Guid listId)
    {
        return await _listRepository.GetByIdAsync(listId);
    }

    public async Task<BoardList?> GetListWithCardsAsync(Guid listId)
    {
        return await _listRepository.GetListWithCardsAsync(listId);
    }

    public async Task<BoardList> CreateListAsync(BoardList list)
    {
        // Verificar se o board existe
        var board = await _boardRepository.GetByIdAsync(list.BoardId);
        if (board == null)
        {
            throw new ArgumentException($"Board with ID {list.BoardId} does not exist.");
        }

        // Obter a posição mais alta atual e incrementar
        var lists = await _listRepository.GetListsByBoardIdAsync(list.BoardId);
        list.Position = lists.Any() ? lists.Max(l => l.Position) + 1 : 0;

        await _listRepository.AddAsync(list);
        await _listRepository.SaveChangesAsync();
        return list;
    }

    public async Task UpdateListAsync(BoardList list)
    {
        await _listRepository.UpdateAsync(list);
        await _listRepository.SaveChangesAsync();
    }

    public async Task DeleteListAsync(Guid listId)
    {
        var list = await _listRepository.GetByIdAsync(listId);
        if (list != null)
        {
            await _listRepository.DeleteAsync(list);
            await _listRepository.SaveChangesAsync();
        }
    }

    public async Task ReorderListsAsync(Guid boardId, Dictionary<Guid, int> listPositions)
    {
        await _listRepository.ReorderListsAsync(boardId, listPositions);
    }
}