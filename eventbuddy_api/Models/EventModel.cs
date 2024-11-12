using System.ComponentModel.DataAnnotations;

namespace eventbuddy_api.Models;

public class Event
{
    [Key]
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public float? Latitude { get; set; }
    public float? Longitude { get; set; }
    public int OrganizerId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int SoldTickets { get; set; } = 0;
    public int? MaxTickets { get; set; }
    public string? TicketUrl { get; set; }

    // Event characteristics
    public float EventSize { get; set; }
    public float Interactivity { get; set; }
    public float Noisiness { get; set; }
    public float Crowdedness { get; set; }

    public List<string> MusicStyles { get; set; } = new List<string>();
    public string EventType { get; set; }

    // System-generated fields
    public int AttendeeCount { get; set; }
    public float AverageRating { get; set; }

    public List<User> Attendees { get; set; }
    public List<PricingTier> PricingStructure { get; set; } = [];
}
