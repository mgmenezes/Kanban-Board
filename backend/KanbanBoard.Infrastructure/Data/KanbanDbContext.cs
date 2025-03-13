// KanbanBoard.Infrastructure/Data/KanbanDbContext.cs
namespace KanbanBoard.Infrastructure.Data;

using KanbanBoard.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

public class KanbanDbContext : DbContext
{
    public KanbanDbContext(DbContextOptions<KanbanDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Board> Boards { get; set; } = null!;
    public DbSet<BoardList> BoardLists { get; set; } = null!;
    public DbSet<Card> Cards { get; set; } = null!;
    public DbSet<Label> Labels { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações de entidades
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();

            // Índices
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.UserName).IsUnique();
        });

        modelBuilder.Entity<Board>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);

            // Relacionamentos
            entity.HasOne(e => e.Owner)
                  .WithMany(u => u.Boards)
                  .HasForeignKey(e => e.OwnerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BoardList>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Position).IsRequired();

            // Relacionamentos
            entity.HasOne(e => e.Board)
                  .WithMany(b => b.Lists)
                  .HasForeignKey(e => e.BoardId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Índices
            entity.HasIndex(e => new { e.BoardId, e.Position });
        });

        modelBuilder.Entity<Card>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Position).IsRequired();

            // Relacionamentos
            entity.HasOne(e => e.BoardList)
                  .WithMany(l => l.Cards)
                  .HasForeignKey(e => e.BoardListId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.AssignedTo)
                  .WithMany()
                  .HasForeignKey(e => e.AssignedToId)
                  .OnDelete(DeleteBehavior.NoAction);

            // Índices
            entity.HasIndex(e => new { e.BoardListId, e.Position });
        });

        modelBuilder.Entity<Label>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Color).IsRequired().HasMaxLength(7); // Formato hex: #RRGGBB
        });

        // Relacionamento muitos-para-muitos entre Card e Label
        modelBuilder.Entity<Card>()
            .HasMany(c => c.Labels)
            .WithMany(l => l.Cards)
            .UsingEntity(j => j.ToTable("CardLabels"));

        // Adiciona automaticamente timestamps nas entidades
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Atualiza automaticamente timestamps ao salvar mudanças
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}