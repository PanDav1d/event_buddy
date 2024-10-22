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
        var tickets = await _context.Ticket.Include(t => t.Event).Where(t => t.OwnerId == user_id).ToListAsync();
        return Results.Ok(tickets);
    }

    [HttpPost("tickets/purchase")]
    public async Task<IResult> PurchaseTicket([FromBody] TicketPurchaseRequest request)
    {
        var prevTicket = await _context.Ticket.Where(t => t.OwnerId == request.UserId && t.EventId == request.EventId).FirstOrDefaultAsync();
        if (prevTicket != null)
            return Results.BadRequest("Ticket already bought");

        var user = await _context.User.FindAsync(request.UserId);
        if (user == null)
            return Results.NotFound("User not found");

        var @event = await _context.Event.FindAsync(request.EventId);
        if (@event == null)
            return Results.NotFound("Event not found");
        if (@event.SoldTickets >= @event.MaxTickets && @event.MaxTickets != null)
            return Results.BadRequest("Event sold out");

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
        return Results.Ok(ticket);
    }

    [HttpPost("tickets/verify")]
    public async Task<IResult> VerifyTicket([FromBody] TicketVerificationRequest request)
    {
        var ticket = await _context.Ticket.FirstOrDefaultAsync(t => t.QRCode == request.QRCode);

        if (ticket == null)
            return Results.NotFound("Ticket not found");

        if (!ticket.IsValid)
            return Results.BadRequest("Ticket is no longer valid");

        if (ticket.UsedAt.HasValue)
            return Results.BadRequest("Ticket has already been used");

        ticket.UsedAt = DateTime.Now;
        ticket.IsValid = false;
        await _context.SaveChangesAsync();

        return Results.Ok("Ticket has been activated");
    }
}