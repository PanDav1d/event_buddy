using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace eventbuddy_api.Models;

public class FriendRequest
{
    [Key]
    public int Id { get; set; }
    public int FromUserId { get; set; }
    [JsonIgnore]
    public User FromUser { get; set; }
    public int ToUserId { get; set; }
    [JsonIgnore]
    public User ToUser { get; set; }
    public string Status { get; set; } = "pending";
    public DateTime DateCreated { get; set; } = DateTime.Now;
}