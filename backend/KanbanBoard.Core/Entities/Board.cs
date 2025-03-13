namespace KanbanBoard.Core.Entities;

public class Board : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }


    public User Owner { get; set; } = null!;
    public ICollection<BoardList> Lists { get; set; } = new List<BoardList>();
}


