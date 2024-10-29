using eventbuddy_api.Data;
using eventbuddy_api.Models;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Services;
public class FeedSectionService(RecommendationService recommendationService, EventbuddyDbContext context)
{
    private readonly RecommendationService _recommendationService = recommendationService;
    private readonly EventbuddyDbContext _context = context;
    public async Task<Dictionary<string, List<dynamic>>> GetFeed(int userId)
    {
        var feed = new Dictionary<string, List<dynamic>>();

        var spotlightEvent = await GetSpotlightEvent(userId);
        var personalizedFeed = await _recommendationService.GetPersonalizedFeed(userId);
        var nearbyEvents = await GetNearbyEvents(userId);

        feed["Im Spotlight"] = [await TransformEventWithSavedStatus(spotlightEvent, userId)];
        feed["Für dich"] = await TransformEventsWithSavedStatus(personalizedFeed, userId);
        feed["In deiner Nähe"] = await TransformEventsWithSavedStatus(nearbyEvents, userId);

        return feed;
    }

    private async Task<dynamic> TransformEventWithSavedStatus(Event evt, int userId)
    {
        return new
        {
            evt.Id,
            evt.Title,
            evt.ImageUrl,
            evt.Description,
            evt.StartDate,
            evt.EndDate,
            evt.Longitude,
            evt.Latitude,
            evt.OrganizerId,
            EventSaved = await _context.SavedEvent.AnyAsync(s => s.EventId == evt.Id && s.UserId == userId),
            SavedAmount = await _context.SavedEvent.CountAsync(se => se.EventId == evt.Id)
        };
    }

    private async Task<List<dynamic>> TransformEventsWithSavedStatus(List<Event> events, int userId)
    {
        var result = new List<dynamic>();
        foreach (var evt in events)
        {
            result.Add(await TransformEventWithSavedStatus(evt, userId));
        }
        return result;
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