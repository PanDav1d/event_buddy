using System.ComponentModel.DataAnnotations;

namespace eventbuddy_api.Models;

public class User
{
    [Key]
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? BuddyName { get; set; }

    public List<FriendRequest> SentFriendRequests { get; set; }
    public List<FriendRequest> ReceivedFriendRequests { get; set; }
    public List<Friendship> Friendships { get; set; }
}