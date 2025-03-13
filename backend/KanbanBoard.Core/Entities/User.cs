namespace KanbanBoard.Core.Entities;

public class User : BaseEntity
{
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;


    public ICollection<Board> Boards { get; set; } = new List<Board>();
    public ICollection<Card> AssignedCards { get; set; } = new List<Card>();
}
