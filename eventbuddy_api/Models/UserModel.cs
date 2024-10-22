using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace eventbuddy_api.Models;

public class User
{
    [Key]
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Password { get; set; }
    public string? BuddyName { get; set; }

    // User preferences
    public float PreferredEventSize { get; set; }
    public float PreferredInteractivity { get; set; }
    public float PreferredNoisiness { get; set; }
    public float PreferredCrowdedness { get; set; }

    public List<string> PreferredMusicStyles { get; set; } = new List<string>();
    public List<string> PreferredEventTypes { get; set; } = new List<string>();

    // System-generated fields
    public float UserActivityLevel { get; set; }
    public float SocialScore { get; set; }
    public DateTime LastActiveDate { get; set; }
    public int EventsAttended { get; set; }

    public List<FriendRequest> SentFriendRequests { get; set; }
    public List<FriendRequest> ReceivedFriendRequests { get; set; }
    public List<Friendship> Friendships { get; set; }
}