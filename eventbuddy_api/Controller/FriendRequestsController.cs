using eventbuddy_api.Data;
using eventbuddy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Controller;

[ApiController]
[Route("api/v1")]
public class FriendRequestsController(EventbuddyDbContext context) : ControllerBase
{
    private readonly EventbuddyDbContext _context = context;

    [HttpPost("friend_requests/send")]
    public async Task<IResult> SendFriendRequest(int fromUserId, int toUserId)
    {
        var existingRequest = await _context.FriendRequest
            .FirstOrDefaultAsync(fr =>
                (fr.FromUserId == fromUserId && fr.ToUserId == toUserId) ||
                (fr.FromUserId == toUserId && fr.ToUserId == fromUserId));

        if (existingRequest != null)
        {
            return Results.BadRequest("A pending or accepted friend request already exists between these users.");
        }

        var request = new FriendRequest
        {
            FromUserId = fromUserId,
            ToUserId = toUserId,
        };
        _context.FriendRequest.Add(request);
        await _context.SaveChangesAsync();
        return Results.Ok();
    }

    [HttpPost("friend_requests/respond")]
    public async Task<IResult> RespondFriendRequest(int user_id, int requestId, string status)
    {
        var request = await _context.FriendRequest.FindAsync(requestId);
        if (request == null) return Results.NotFound();

        if (status == "accepted" && user_id == request.ToUserId)
        {
            request.Status = status;
            _context.Friendship.Add(new Friendship
            {
                UserId1 = request.FromUserId,
                UserId2 = request.ToUserId
            });
        }
        else if (status == "declined" && user_id == request.ToUserId)
        {
            _context.FriendRequest.Remove(request);
        }
        else
        {
            return Results.BadRequest("Invalid status or user is not authorized to respond to this request.");
        }
        await _context.SaveChangesAsync();
        return Results.Ok();
    }

    [HttpGet("friend_requests")]
    public async Task<IResult> GetFriendRequests()
    {
        var requests = await _context.FriendRequest.ToListAsync();
        if (requests.Count == 0)
            return Results.Ok("No friend requests found");
        return Results.Ok(requests);
    }

}