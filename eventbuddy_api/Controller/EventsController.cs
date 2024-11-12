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
public class EventsController : ControllerBase
{
    private readonly EventbuddyDbContext _context;
    private readonly FeedSectionService _feedSectionService;

    public EventsController(EventbuddyDbContext context, FeedSectionService feedSectionService)
    {
        _context = context;
        _feedSectionService = feedSectionService;
    }

    [HttpGet("events")]
    public async Task<IResult> GetEventsFeedForUserID([FromQuery] int user_id)
    {
        var user = await _context.User.FindAsync(user_id);
        if (user == null)
        {
            return Results.NotFound(new { info = "User not found", payload = String.Empty });
        }
        var feed = await _feedSectionService.GetFeed(user.Id);
        return Results.Ok(new { info = "Successfully reached personal Feed", payload = feed });
    }

    [HttpGet("events/{user_id}/{event_id}")]
    public async Task<IResult> GetEventByID(int event_id, int user_id)
    {
        var evt = await _context.Event.Include(e => e.PricingStructure).Where(e => e.Id == event_id).FirstOrDefaultAsync();
        var user = await _context.User.FindAsync(user_id);

        if (evt == null)
        {
            return Results.NotFound();
        }
        var @event = new
        {
            Id = evt.Id,
            Title = evt.Title,
            Description = evt.Description,
            ImageUrl = evt.ImageUrl,
            StartDate = evt.StartDate,
            EndDate = evt.EndDate,
            SoldTickets = evt.SoldTickets,
            MaxTickets = evt.MaxTickets,
            Longitude = evt.Longitude,
            Latitude = evt.Latitude,
            OrganizerId = evt.OrganizerId,
            OrganizerName = user.Username,
            PricingStructure = evt.PricingStructure,
            EventSaved = await _context.SavedEvent.AnyAsync(s => s.EventId == evt.Id && s.UserId == user_id),
            SavedAmount = await _context.SavedEvent.CountAsync(se => se.EventId == evt.Id)
        };

        var similarEvents = await _context.Event.Where(e => e.Id != event_id).Take(10).ToListAsync();
        var organizerEvents = await _context.Event.Where(e => e.OrganizerId == evt.OrganizerId && e.Id != evt.Id).ToListAsync();
        return Results.Ok(new
        {
            info = "Found event with that id",
            payload = new { @event, similarEvents, organizerEvents }
        });
    }

    [HttpPost("events")]
    public async Task<IResult> PostEvent(Event e)
    {
        await _context.Event.AddAsync(e);
        await _context.SaveChangesAsync();
        return Results.Ok(new { info = "Event created", payload = String.Empty });
    }

    [HttpDelete("events/{event_id}")]
    public async Task<IResult> DeleteEvent(int event_id)
    {
        var @event = await _context.Event
            .Include(e => e.PricingStructure)
            .Include(e => e.Attendees)
            .FirstOrDefaultAsync(e => e.Id == event_id);

        if (@event == null)
            return Results.NotFound();

        var tickets = await _context.Ticket.Where(t => t.EventId == event_id).ToListAsync();
        var savedEvents = await _context.SavedEvent.Where(s => s.EventId == event_id).ToListAsync();

        _context.Ticket.RemoveRange(tickets);
        _context.SavedEvent.RemoveRange(savedEvents);
        _context.PricingTier.RemoveRange(@event.PricingStructure);
        _context.Event.Remove(@event);

        await _context.SaveChangesAsync();
        return Results.Ok(new { info = "deleted", payload = String.Empty });
    }
}
