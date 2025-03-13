﻿// <auto-generated />
using System;
using KanbanBoard.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace KanbanBoard.Infrastructure.Migrations
{
    [DbContext(typeof(KanbanDbContext))]
    partial class KanbanDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CardLabel", b =>
                {
                    b.Property<Guid>("CardsId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("LabelsId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("CardsId", "LabelsId");

                    b.HasIndex("LabelsId");

                    b.ToTable("CardLabels", (string)null);
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.Board", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("Boards");
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.BoardList", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("BoardId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("Position")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("BoardId", "Position");

                    b.ToTable("BoardLists");
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.Card", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("AssignedToId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("BoardListId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("nvarchar(2000)");

                    b.Property<DateTime?>("DueDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Position")
                        .HasColumnType("int");

                    b.Property<int>("Priority")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("AssignedToId");

                    b.HasIndex("UserId");

                    b.HasIndex("BoardListId", "Position");

                    b.ToTable("Cards");
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.Label", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasMaxLength(7)
                        .HasColumnType("nvarchar(7)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Labels");
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("UserName")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("CardLabel", b =>
                {
                    b.HasOne("KanbanBoard.Core.Entities.Card", null)
                        .WithMany()
                        .HasForeignKey("CardsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("KanbanBoard.Core.Entities.Label", null)
                        .WithMany()
                        .HasForeignKey("LabelsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.Board", b =>
                {
                    b.HasOne("KanbanBoard.Core.Entities.User", "Owner")
                        .WithMany("Boards")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.BoardList", b =>
                {
                    b.HasOne("KanbanBoard.Core.Entities.Board", "Board")
                        .WithMany("Lists")
                        .HasForeignKey("BoardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Board");
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.Card", b =>
                {
                    b.HasOne("KanbanBoard.Core.Entities.User", "AssignedTo")
                        .WithMany()
                        .HasForeignKey("AssignedToId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne("KanbanBoard.Core.Entities.BoardList", "BoardList")
                        .WithMany("Cards")
                        .HasForeignKey("BoardListId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("KanbanBoard.Core.Entities.User", null)
                        .WithMany("AssignedCards")
                        .HasForeignKey("UserId");

                    b.Navigation("AssignedTo");

                    b.Navigation("BoardList");
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.Board", b =>
                {
                    b.Navigation("Lists");
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.BoardList", b =>
                {
                    b.Navigation("Cards");
                });

            modelBuilder.Entity("KanbanBoard.Core.Entities.User", b =>
                {
                    b.Navigation("AssignedCards");

                    b.Navigation("Boards");
                });
#pragma warning restore 612, 618
        }
    }
}
