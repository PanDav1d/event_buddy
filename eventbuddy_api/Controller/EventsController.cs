using System;
using eventbuddy_api.Data;
using eventbuddy_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Controller;

[Authorize]
[ApiController]
[Route("api/v1")]
public class EventsController(EventbuddyDbContext context) : ControllerBase
{
    private readonly EventbuddyDbContext _context = context;

    [HttpGet("events")]
    public async Task<IResult> GetEventsForUserID([FromQuery] int user_id)
    {
        var user = await _context.User.FindAsync(user_id);
        if (user == null)
        {
            return Results.NotFound("User not found");
        }

        var events = await _context.Event
            .Where(e => e.StartDate > DateTime.UtcNow)
            .ToListAsync();

        var eventList = events
            .Select(e => new
            {
                Event = e,
                MatchScore = CalculateMatchScore(e, user)
            })
            .OrderByDescending(e => e.MatchScore)
            .Take(50)
            .Select(e => new
            {
                Id = e.Event.Id,
                Title = e.Event.Title,
                Description = e.Event.Description,
                StartDate = e.Event.StartDate,
                EndDate = e.Event.EndDate,
                EventSaved = _context.SavedEvent.Any(s => s.EventId == e.Event.Id && s.UserId == user_id),
                SavedAmount = _context.SavedEvent.Count(se => se.EventId == e.Event.Id),
                MatchScore = e.MatchScore
            })
            .ToList();

        if (eventList.Count == 0)
        {
            return Results.NotFound("No events found");
        }
        return Results.Ok(eventList);
    }

    private float CalculateMatchScore(Event e, User u)
    {
        float score = 0;

        // Compare event characteristics with user preferences
        score += (1 - Math.Abs(e.EventSize - u.PreferredEventSize)) * 10;
        score += (1 - Math.Abs(e.Interactivity - u.PreferredInteractivity)) * 10;
        score += (1 - Math.Abs(e.Noisiness - u.PreferredNoisiness)) * 10;
        score += (1 - Math.Abs(e.Crowdedness - u.PreferredCrowdedness)) * 10;

        // Check for matching music styles
        score += e.MusicStyles.Intersect(u.PreferredMusicStyles).Count() * 5;

        // Check for matching event type
        if (u.PreferredEventTypes.Contains(e.EventType))
        {
            score += 20;
        }

        // Consider user's activity level and social score
        score += u.UserActivityLevel * 5;
        score += u.SocialScore * 5;

        // Adjust score based on user's event attendance history
        score += Math.Min(u.EventsAttended, 10) * 2;

        return score;
    }

    [HttpGet("events/{event_id}")]
    public async Task<IResult> GetEventByID(int event_id)
    {
        var events = await _context.Event.Where(e => e.Id == event_id).FirstOrDefaultAsync();
        if (events == null)
        {
            return Results.NotFound();
        }
        return Results.Ok(events);
    }

    [HttpPost("events")]
    public async Task<IResult> PostEvent(Event e)
    {
        await _context.Event.AddAsync(e);
        await _context.SaveChangesAsync();
        return Results.Ok("Event created");
    }
}