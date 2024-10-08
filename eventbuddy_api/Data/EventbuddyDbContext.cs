using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using eventbuddy_api.Models;

namespace eventbuddy_api.Data
{
    public class EventbuddyDbContext : DbContext
    {
        public EventbuddyDbContext(DbContextOptions<EventbuddyDbContext> options)
            : base(options)
        {
        }

        public DbSet<Event> Event { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<SavedEvent> SavedEvent { get; set; }
        public DbSet<FriendRequest> FriendRequest { get; set; }
        public DbSet<Friendship> Friendship { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.User1)
                .WithMany(u => u.Friendships)
                .HasForeignKey(f => f.UserId1)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.User2)
                .WithMany()
                .HasForeignKey(f => f.UserId2)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FriendRequest>()
                .HasOne(f => f.FromUser)
                .WithMany(u => u.SentFriendRequests)
                .HasForeignKey(f => f.FromUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FriendRequest>()
                .HasOne(f => f.ToUser)
                .WithMany(u => u.ReceivedFriendRequests)
                .HasForeignKey(f => f.ToUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}