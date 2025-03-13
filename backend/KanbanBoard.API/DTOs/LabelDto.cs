namespace KanbanBoard.API.DTOs;

public class LabelDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

public class LabelCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

public class LabelUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

public class CardLabelDto
{
    public Guid CardId { get; set; }
    public Guid LabelId { get; set; }
}