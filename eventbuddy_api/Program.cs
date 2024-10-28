using eventbuddy_api;
using eventbuddy_api.Data;
using eventbuddy_api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using eventbuddy_api.Services;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<Token>();

builder.Services.AddScoped<RecommendationService>();
builder.Services.AddScoped<FeedSectionService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddDbContext<EventbuddyDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.MapGet("/api/v1/", (EventbuddyDbContext ctx) => "Eventbuddy api").WithName("GetRoot").WithOpenApi();

app.MapGet("/api/v1/search", async (EventbuddyDbContext ctx, int user_id, string q) =>
{
    var currentUser = await ctx.User.FindAsync(user_id);
    if (currentUser == null)
        return Results.BadRequest("No user");
    if (q.IsNullOrEmpty())
        return Results.Ok("Nothing searched");
    if (q.Length < 3)
        return Results.Ok("Query too short");

    var users = await ctx.User
        .Where(u => u.Username!.Contains(q))
        .OrderByDescending(u => EF.Functions.Collate(u.Username!, "SQL_Latin1_General_CP1_CI_AS").IndexOf(q))
        .Take(25)
        .Select(u => new
        {
            User = u,
            IsFriend = ctx.Friendship.Any(f =>
                (f.UserId1 == user_id && f.UserId2 == u.Id) ||
                (f.UserId2 == user_id && f.UserId1 == u.Id)),
            HasSentRequest = ctx.FriendRequest.Any(fr =>
                fr.FromUserId == user_id && fr.ToUserId == u.Id && fr.Status == "pending"),
            HasReceivedRequest = ctx.FriendRequest.Any(fr =>
                fr.FromUserId == u.Id && fr.ToUserId == user_id && fr.Status == "pending")
        })
        .ToListAsync();

    var events = await ctx.Event.Where(e => e.Title!.Contains(q))
        .OrderByDescending(e => EF.Functions.Collate(e.Title!, "SQL_Latin1_General_CP1_CI_AS").IndexOf(q))
        .Take(25)
        .ToListAsync();

    return Results.Ok(new { users = users, events = events });
}).WithName("Search").WithOpenApi();

app.Run();
