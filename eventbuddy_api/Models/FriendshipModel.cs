using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace eventbuddy_api.Models;

public class Friendship
{
    [Key]
    public int Id { get; set; }
    public int UserId1 { get; set; }
    [JsonIgnore]
    public User User1 { get; set; }
    public int UserId2 { get; set; }
    [JsonIgnore]
    public User User2 { get; set; }
    public DateTime FriendshipDate { get; set; } = DateTime.Now;

}