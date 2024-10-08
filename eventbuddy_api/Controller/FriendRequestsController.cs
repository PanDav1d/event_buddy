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
        var request = new FriendRequest
        {
            FromUserId = fromUserId,
            ToUserId = toUserId
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

        request.Status = status;
        if (status == "accepted" && user_id == request.ToUserId)
        {
            _context.Friendship.Add(new Friendship
            {
                UserId1 = request.FromUserId,
                UserId2 = request.ToUserId
            });
        }
        else if ((status == "declined" && user_id == request.FromUserId) || user_id == request.FromUserId)
        {
            _context.FriendRequest.Remove(request);
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