using System;
using eventbuddy_api;
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
        {
            return Results.NotFound("User not found");
        }
        return Results.Ok(user);
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
        var user = await _context.User.Where(u => u.Name == username).FirstOrDefaultAsync();
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