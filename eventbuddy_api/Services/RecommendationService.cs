using eventbuddy_api.Data;
using eventbuddy_api.Models;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Services;

public class RecommendationService(EventbuddyDbContext context)
{
    private readonly EventbuddyDbContext _context = context;

    public async Task<List<Event>> GetPersonalizedFeed(int userId)
    {
        var user = await _context.User.FindAsync(userId);
        var events = await _context.Event.Include(e => e.PricingStructure).Where(e => e.StartDate >= DateTime.Now).Take(10).ToListAsync();
        return events;
    }
}