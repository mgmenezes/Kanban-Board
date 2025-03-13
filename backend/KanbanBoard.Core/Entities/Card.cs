namespace KanbanBoard.Core.Entities;

public class Card : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Position { get; set; }
    public DateTime? DueDate { get; set; }
    public CardPriority Priority { get; set; } = CardPriority.Medium;
    public Guid BoardListId { get; set; }
    public Guid? AssignedToId { get; set; }

    public BoardList BoardList { get; set; } = null!;
    public User? AssignedTo { get; set; }
    public ICollection<Label> Labels { get; set; } = new List<Label>();
}
