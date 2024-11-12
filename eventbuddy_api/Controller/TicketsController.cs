using System;
using eventbuddy_api.Data;
using eventbuddy_api.Migrations;
using eventbuddy_api.Models;
using eventbuddy_api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Controller;

[Authorize]
[ApiController]
[Route("api/v1")]
public class TicketsController(EventbuddyDbContext context) : ControllerBase
{
    private readonly EventbuddyDbContext _context = context;

    [HttpGet("tickets/{user_id}")]
    public async Task<IResult> GetUserTickets(int user_id)
    {
        var tickets = await _context.Ticket
            .Include(t => t.Event)
            .Where(t => t.OwnerId == user_id)
            .Select(t => new
            {
                TicketId = t.Id,
                CreatedAt = t.CreatedAt,
                IsValid = t.IsValid,
                QRCode = t.QRCode,
                Event = new
                {
                    Id = t.Event!.Id,
                    Title = t.Event.Title,
                    ImageUrl = t.Event.ImageUrl,
                    Description = t.Event.Description,
                    StartDate = t.Event.StartDate,
                    EndDate = t.Event.EndDate
                }
            })
            .ToListAsync();
        if (tickets.Count == 0)
            return Results.Ok(new { info = "User has no Tickets", payload = new List<dynamic>() });
        return Results.Ok(new { info = "Tickets for user found", payload = tickets });
    }

    [HttpPost("tickets/purchase")]
    public async Task<IResult> PurchaseTicket([FromBody] TicketPurchaseRequest request)
    {
        var prevTicket = await _context.Ticket.Where(t => t.OwnerId == request.UserId && t.EventId == request.EventId).FirstOrDefaultAsync();
        if (prevTicket != null)
            return Results.BadRequest(new { info = "Ticket already bought", payload = String.Empty });

        var user = await _context.User.FindAsync(request.UserId);
        if (user == null)
            return Results.NotFound(new { info = "User not found", payload = String.Empty });

        var @event = await _context.Event.FindAsync(request.EventId);
        if (@event == null)
            return Results.NotFound(new { info = "Event not found", payload = String.Empty });
        if (@event.SoldTickets >= @event.MaxTickets && @event.MaxTickets != null)
            return Results.BadRequest(new { info = "Event sold out", payload = String.Empty });

        var ticket = new Ticket
        {
            OwnerId = request.UserId,
            EventId = request.EventId,
            CreatedAt = DateTime.Now,
        };
        ticket.GenerateQRCode();
        _context.Ticket.Add(ticket);
        @event.SoldTickets += 1;
        await _context.SaveChangesAsync();
        return Results.Ok(new { info = "Ticket purchased", payload = ticket });
    }

    [HttpPost("tickets/verify")]
    public async Task<IResult> VerifyTicket([FromBody] TicketVerificationRequest request)
    {
        var ticket = await _context.Ticket.FirstOrDefaultAsync(t => t.QRCode == request.QRCode);

        if (ticket == null)
            return Results.NotFound(new { info = "Ticket not found", payload = String.Empty });

        if (!ticket.IsValid)
            return Results.BadRequest(new { info = "Ticket is no longer valid", payload = String.Empty });

        if (ticket.UsedAt.HasValue)
            return Results.BadRequest(new { info = "Ticket has already been used", payload = String.Empty });

        ticket.UsedAt = DateTime.Now;
        ticket.IsValid = false;
        await _context.SaveChangesAsync();

        return Results.Ok(new { info = "Ticket has been activated", payload = String.Empty });
    }
}
