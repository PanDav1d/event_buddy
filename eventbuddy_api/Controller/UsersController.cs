using eventbuddy_api.Data;
using eventbuddy_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eventbuddy_api.Controller;

[Authorize]
[ApiController]
[Route("api/v1")]
public class UsersController(EventbuddyDbContext context, Token _tokenGenerator) : ControllerBase
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

    [HttpPut("users/preferences")]
    public async Task<IResult> UpdateUserPreferences(int user_id, [FromBody] UserPreferences preferences)
    {
        var user = await _context.User.FindAsync(user_id);
        if (user == null)
            return Results.NotFound("User not found");

        user.PreferredEventSize = (float)preferences.PreferredEventSize;
        user.PreferredInteractivity = (float)preferences.PreferredInteractivity;
        user.PreferredNoisiness = (float)preferences.PreferredNoisiness;
        user.PreferredCrowdedness = (float)preferences.PreferredCrowdedness;
        user.Latitude = (float?)preferences.Latitude;
        user.Longitude = (float?)preferences.Longitude;
        user.Radius = preferences.Radius;

        await _context.SaveChangesAsync();
        return Results.Ok("Preferences updated successfully");
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
        var user = await _context.User
            .Include(u => u.ReceivedFriendRequests)
            .ThenInclude(fr => fr.FromUser)
            .FirstOrDefaultAsync(u => u.Id == user_id);

        if (user == null)
            return Results.NotFound("User does not exist");

        if (user.ReceivedFriendRequests == null || user.ReceivedFriendRequests.Count == 0)
            return Results.Ok("No friend requests received");

        var friendRequests = user.ReceivedFriendRequests
            .Where(fr => fr.Status == "pending")
            .Select(fr => new
            {
                fr.Id,
                fr.FromUserId,
                FromUsername = fr.FromUser.Username,
                fr.ToUserId,
            });

        return Results.Ok(friendRequests);
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

    [HttpDelete("users/friends/delete")]
    public async Task<IResult> RemoveUserFriend(int user_id, int friend_id)
    {
        try
        {
            var friendship = await _context.Friendship
                .FirstOrDefaultAsync(f =>
                    (f.UserId1 == user_id && f.UserId2 == friend_id) ||
                    (f.UserId1 == friend_id && f.UserId2 == user_id));

            if (friendship == null)
            {
                return Results.NotFound("Friendship not found.");
            }

            _context.Friendship.Remove(friendship);

            var friendRequests = await _context.FriendRequest
                .Where(fr =>
                    (fr.FromUserId == user_id && fr.ToUserId == friend_id) ||
                    (fr.FromUserId == friend_id && fr.ToUserId == user_id))
                .ToListAsync();

            _context.FriendRequest.RemoveRange(friendRequests);

            await _context.SaveChangesAsync();

            return Results.Ok("Friend removed successfully.");
        }
        catch (Exception ex)
        {
            return Results.BadRequest($"An error occurred: {ex.Message}");
        }
    }

    [AllowAnonymous]
    [HttpPost("users/register")]
    public async Task<IResult> RegisterUser([FromBody] User u)
    {
        u.Password = Hash.BuildSHA256(u.Password!);
        u.LastActiveDate = DateTime.Now;
        u.EventsAttended = 0;
        u.UserActivityLevel = 0;
        u.SocialScore = 0;

        await _context.User.AddAsync(u);
        await _context.SaveChangesAsync();
        return Results.Ok("User registered");
    }

    [HttpDelete("users/delete")]
    public async Task<IResult> RemoveUser(int user_id, string password)
    {
        var user = await _context.User.FindAsync(user_id);
        if (user == null)
            return Results.NotFound();
        if (!Hash.Verify(password, user.Password!))
            return Results.BadRequest("No valid password");

        var friend_requests = await _context.FriendRequest
            .Where(f => f.FromUserId == user_id || f.ToUserId == user_id)
            .ToListAsync();

        var friends = await _context.Friendship
            .Where(f => f.UserId1 == user_id || f.UserId2 == user_id)
            .ToListAsync();

        _context.FriendRequest.RemoveRange(friend_requests);
        _context.Friendship.RemoveRange(friends);

        _context.User.Remove(user);
        await _context.SaveChangesAsync();
        return Results.Ok("User deleted");
    }

    [AllowAnonymous]
    [HttpPut("users/change_password")]
    public async Task<IResult> ChangeUserPassword(int user_id, string current_password, string new_password)
    {
        var user = await _context.User.FindAsync(user_id);
        if (user == null)
            return Results.NotFound();
        if (!Hash.Verify(current_password, user.Password!))
            return Results.BadRequest("Password is not valid");
        user.Password = Hash.BuildSHA256(new_password);
        await _context.SaveChangesAsync();
        return Results.Ok("Password changed");
    }

    [AllowAnonymous]
    [HttpPost("users/login")]
    public async Task<IResult> LoginUser([FromQuery] string username, string password)
    {
        var user = await _context.User.Where(u => u.Username == username).FirstOrDefaultAsync();
        if (user == null)
            return Results.NotFound("Username is not valid");
        if (!Hash.Verify(password, user.Password!))
            return Results.NotFound("Password is not valid");
        user.LastActiveDate = DateTime.Now;
        await _context.SaveChangesAsync();
        return Results.Ok(new { user_id = user.Id, access_token = _tokenGenerator.Generate(user) });
    }
}

public class UserPreferences
{
    public double PreferredEventSize { get; set; }
    public double PreferredInteractivity { get; set; }
    public double PreferredNoisiness { get; set; }
    public double PreferredCrowdedness { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int Radius { get; set; }
}