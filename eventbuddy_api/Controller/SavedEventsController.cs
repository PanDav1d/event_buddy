using System;
using eventbuddy_api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Controller;

[Authorize]
[ApiController]
[Route("api/v1")]
public class SavedEventsController(EventbuddyDbContext context) : ControllerBase
{
    private readonly EventbuddyDbContext _context = context;

    [HttpGet("saved_events/{user_id}")]
    public async Task<IResult> GetSavedEventsByUser(int user_id)
    {
        var events = await (from e in _context.Event
                            join se in _context.SavedEvent on e.Id equals se.EventId
                            where se.UserId == user_id
                            select new
                            {
                                e.Id,
                                e.Title,
                                e.ImageUrl,
                                e.Description,
                                e.StartDate,
                                e.EndDate,
                                e.Longitude,
                                e.Latitude,
                                e.OrganizerId,
                                EventSaved = _context.SavedEvent.Any(s => s.EventId == e.Id && s.UserId == user_id),
                                SavedAmount = _context.SavedEvent.Count(se => se.EventId == e.Id)
                            }).ToListAsync();
        return events == null ? Results.NotFound() : Results.Ok(events);
    }

    [HttpPost("saved_events/{event_id}/{user_id}")]
    public async Task<IResult> ChangeSavedStatus(int event_id, int user_id)
    {
        var savedEvent = _context.SavedEvent.Where(e => e.UserId == user_id && e.EventId == event_id).FirstOrDefault();
        var message = string.Empty;
        if (savedEvent != null)
        {
            _context.SavedEvent.Remove(savedEvent);
            message = "Unsaved";
        }
        else
        {
            savedEvent = new()
            {
                EventId = event_id,
                UserId = user_id
            };
            await _context.SavedEvent.AddAsync(savedEvent);
            message = "Saved";
        }
        await _context.SaveChangesAsync();
        return Results.Ok(message);
    }
}