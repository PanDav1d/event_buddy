using System.ComponentModel.DataAnnotations;

namespace eventbuddy_api.Models;

public class SavedEvent
{
    [Key]
    public int Id { get; set; }
    public int UserId { get; set; }
    public int EventId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}