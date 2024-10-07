using System;
using eventbuddy_api.Data;
using eventbuddy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Controller;

[ApiController]
[Route("api/v1")]
public class EventsController(EventbuddyDbContext context) : ControllerBase
{
    private readonly EventbuddyDbContext _context = context;

    [HttpGet("events")]
    public async Task<IResult> GetEventsForUserID([FromQuery] int user_id)
    {
        var events = await (from e in _context.Event
                            select new
                            {
                                EventId = e.Id,
                                EventTitle = e.Title,
                                EventDescription = e.Description,
                                EventStartDate = e.StartDate,
                                EventEndDate = e.EndDate,
                                EventSaved = _context.SavedEvent.Any(s => s.EventId == e.Id && s.UserId == user_id),
                                SavedAmount = _context.SavedEvent.Count(se => se.EventId == e.Id)
                            }).ToListAsync();
        if (events.Count == 0)
        {
            return Results.NotFound("No event found");
        }
        return Results.Ok(events);
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