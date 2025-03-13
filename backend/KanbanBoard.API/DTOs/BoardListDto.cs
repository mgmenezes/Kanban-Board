namespace KanbanBoard.API.DTOs;

public class BoardListDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Position { get; set; }
    public Guid BoardId { get; set; }
}

public class BoardListDetailDto : BoardListDto
{
    public List<CardDto> Cards { get; set; } = new List<CardDto>();
}

public class BoardListCreateDto
{
    public string Title { get; set; } = string.Empty;
    public Guid BoardId { get; set; }
}

public class BoardListUpdateDto
{
    public string Title { get; set; } = string.Empty;
}

public class BoardListReorderDto
{
    public Guid BoardId { get; set; }
    public Dictionary<Guid, int> ListPositions { get; set; } = new Dictionary<Guid, int>();
}