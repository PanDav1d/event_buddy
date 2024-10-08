using eventbuddy_api.Data;
using eventbuddy_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Controller;

[ApiController]
[Route("api/v1")]
public class UsersController(EventbuddyDbContext context) : ControllerBase
{
    private readonly EventbuddyDbContext _context = context;

    [HttpGet("users")]
    public async Task<IResult> GetUserByID(int user_id)
    {
        var user = await _context.User.Where(u => u.Id == user_id).FirstOrDefaultAsync();
        if (user == null)
            return Results.NotFound("User not found");
        return Results.Ok(user);
    }

    [HttpGet("users/sent_friend_requests")]
    public async Task<IResult> GetUserSentFriendRequests(int user_id)
    {
        var user = await _context.User.Include(u => u.SentFriendRequests).FirstOrDefaultAsync(u => u.Id == user_id);
        if (user == null)
            return Results.NotFound("User does not exist");
        if (user.SentFriendRequests == null || user.SentFriendRequests.Count == 0)
            return Results.Ok("No friend requests sent");
        return Results.Ok(user.SentFriendRequests);
    }

    [HttpGet("users/received_friend_requests")]
    public async Task<IResult> GetUserReceivedFriendRequests(int user_id)
    {
        var user = await _context.User.Include(u => u.ReceivedFriendRequests).FirstOrDefaultAsync(u => u.Id == user_id);
        if (user == null)
            return Results.NotFound("User does not exist");
        if (user.ReceivedFriendRequests == null || user.ReceivedFriendRequests.Count == 0)
            return Results.Ok("No friend requests received");
        return Results.Ok(user.ReceivedFriendRequests);
    }

    [HttpGet("users/friends")]
    public async Task<IResult> GetUserFriends(int user_id)
    {
        var user = await _context.User
            .Include(u => u.Friendships)
            .FirstOrDefaultAsync(u => u.Id == user_id);

        if (user == null)
            return Results.NotFound();

        var friends = await _context.Friendship
            .Where(f => f.UserId1 == user_id || f.UserId2 == user_id)
            .Select(f => f.UserId1 == user_id ? new { Id = f.User2.Id, Username = f.User2.Username } : new { Id = f.User1.Id, Username = f.User1.Username })
            .ToListAsync();

        return Results.Ok(friends);
    }

    [HttpPost("users/register")]
    public async Task<IResult> RegisterUser([FromBody] User u)
    {
        await _context.User.AddAsync(u);
        await _context.SaveChangesAsync();
        return Results.Ok("User registered");
    }
    [HttpPost("users/login")]
    public async Task<IResult> LoginUser([FromQuery] string username, string password)
    {
        var user = await _context.User.Where(u => u.Username == username).FirstOrDefaultAsync();
        if (user == null)
        {
            return Results.NotFound("Username is not valid");
        }
        if (!Hash.Verify(password, user.Password!))
        {
            return Results.NotFound("Password is not valid");
        }
        return Results.Ok(new { user_id = user.Id, access_token = "abc" });
    }
}