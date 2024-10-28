using eventbuddy_api.Data;
using eventbuddy_api.Models;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Services;
public class FeedSectionService(RecommendationService recommendationService, EventbuddyDbContext context)
{
    private readonly RecommendationService _recommendationService = recommendationService;
    private readonly EventbuddyDbContext _context = context;
    public async Task<Dictionary<string, List<Event>>> GetFeed(int userId)
    {
        var feed = new Dictionary<string, List<Event>>();
        feed["Im Spotlight"] = [await this.GetSpotlightEvent(userId)];
        feed["Für dich"] = await _recommendationService.GetPersonalizedFeed(userId);
        feed["In deiner Nähe"] = await this.GetNearbyEvents(userId);

        return feed;
    }

    private async Task<List<Event>> GetNearbyEvents(int userId)
    {
        var user = await _context.User.FindAsync(userId);
        if (user == null)
            return new List<Event>();

        var events = await _context.Event
            .Where(e => e.EndDate > DateTime.Now)
            .Where(e => Math.Sqrt(Math.Pow(e.Latitude.GetValueOrDefault() - user.Latitude.GetValueOrDefault(), 2) +
                                Math.Pow(e.Longitude.GetValueOrDefault() - user.Longitude.GetValueOrDefault(), 2)) <= user.Radius)
            .OrderBy(e => Math.Pow(e.Latitude.GetValueOrDefault() - user.Latitude.GetValueOrDefault(), 2) +
                         Math.Pow(e.Longitude.GetValueOrDefault() - user.Longitude.GetValueOrDefault(), 2))
            .Take(10)
            .ToListAsync();

        return events ?? [];
    }    //this just takes the first one for now
    private async Task<Event> GetSpotlightEvent(int userId) => await _context.Event.OrderByDescending(e => e.Id).FirstOrDefaultAsync() ?? new();
}