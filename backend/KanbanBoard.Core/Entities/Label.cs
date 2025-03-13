namespace KanbanBoard.Core.Entities;

public class Label : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public ICollection<Card> Cards { get; set; } = new List<Card>();
}

