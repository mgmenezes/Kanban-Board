namespace KanbanBoard.API.DTOs;

public class CardDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Position { get; set; }
    public DateTime? DueDate { get; set; }
    public string Priority { get; set; } = string.Empty;
    public Guid BoardListId { get; set; }
    public Guid? AssignedToId { get; set; }
    public UserDto? AssignedTo { get; set; }
    public List<LabelDto> Labels { get; set; } = new List<LabelDto>();
}

public class CardCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public string Priority { get; set; } = "Medium";
    public Guid BoardListId { get; set; }
    public Guid? AssignedToId { get; set; }
}

public class CardUpdateDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public string Priority { get; set; } = string.Empty;
}

public class CardMoveDto
{
    public Guid CardId { get; set; }
    public Guid TargetListId { get; set; }
    public int Position { get; set; }
}

public class CardReorderDto
{
    public Guid ListId { get; set; }
    public Dictionary<Guid, int> CardPositions { get; set; } = new Dictionary<Guid, int>();
}

public class CardAssignDto
{
    public Guid CardId { get; set; }
    public Guid? UserId { get; set; }
}
