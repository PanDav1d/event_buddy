using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Data
{
    public class EventbuddyDbContext : DbContext
    {
        public EventbuddyDbContext(DbContextOptions<EventbuddyDbContext> options)
            : base(options)
        {
        }

        public DbSet<eventbuddy_api.Models.Event> Event { get; set; }
        public DbSet<eventbuddy_api.Models.User> User { get; set; }
        public DbSet<eventbuddy_api.Models.SavedEvent> SavedEvent { get; set; }
    }
}