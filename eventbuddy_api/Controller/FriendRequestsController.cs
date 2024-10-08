using eventbuddy_api.Data;
using eventbuddy_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace eventbuddy_api.Controller;

[ApiController]
[Route("api/v1")]
public class FriendRequestsController(EventbuddyDbContext context) : ControllerBase
{
    private readonly EventbuddyDbContext _context = context;

    [HttpPost("friend_request/send")]
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

    [HttpPost("friend_request/respond")]
    public async Task<IResult> RespondFriendRequest(int requestId, string status)
    {
        var request = await _context.FriendRequest.FindAsync(requestId);
        if (request == null) return Results.NotFound();

        request.Status = status;
        if (status == "accepted")
        {
            _context.Friendship.Add(new Friendship
            {
                UserId1 = request.FromUser.Id,
                UserId2 = request.ToUser.Id
            });
        }
        await _context.SaveChangesAsync();
        return Results.Ok();
    }

}