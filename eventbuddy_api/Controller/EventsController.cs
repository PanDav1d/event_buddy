using System;
using eventbuddy_api.Data;
using eventbuddy_api.Models;
using eventbuddy_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Controller;

[Authorize]
[ApiController]
[Route("api/v1")]
public class EventsController(EventbuddyDbContext context, FeedSectionService feedSectionService) : ControllerBase
{
    private readonly EventbuddyDbContext _context = context;
    private readonly FeedSectionService _feedSectionService = feedSectionService;

    [HttpGet("events")]
    public async Task<IResult> GetEventsFeedForUserID([FromQuery] int user_id)
    {
        var user = await _context.User.FindAsync(user_id);
        if (user == null)
        {
            return Results.NotFound("User not found");
        }
        var feed = await _feedSectionService.GetFeed(user.Id);
        return Results.Ok(feed);
    }

    [HttpGet("events/{event_id}")]
    public async Task<IResult> GetEventByID(int event_id)
    {
        var events = await _context.Event.Where(e => e.Id == event_id).FirstOrDefaultAsync();
        if (events == null)
        {
            return Results.NotFound();
        }

        var similarEvents = await _context.Event.Where(e => e.Id != event_id).Take(10).ToListAsync();
        var organizerEvents = await _context.Event.Where(e => e.OrganizerId == events.OrganizerId && e.Id != events.Id).ToListAsync();
        return Results.Ok(new { events, similarEvents, organizerEvents });
    }

    [HttpPost("events")]
    public async Task<IResult> PostEvent(Event e)
    {
        await _context.Event.AddAsync(e);
        await _context.SaveChangesAsync();
        return Results.Ok("Event created");
    }
}