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
}