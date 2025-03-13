namespace KanbanBoard.API.DTOs;

public class BoardDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
}

public class BoardDetailDto : BoardDto
{
    public List<BoardListDto> Lists { get; set; } = new List<BoardListDto>();
}

public class BoardCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class BoardUpdateDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}