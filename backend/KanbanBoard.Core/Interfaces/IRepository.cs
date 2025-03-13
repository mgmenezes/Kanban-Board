namespace KanbanBoard.Core.Interfaces;

using KanbanBoard.Core.Entities;
using System.Linq.Expressions;

public interface IRepository<T> where T : BaseEntity
{

    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task<int> SaveChangesAsync();
}