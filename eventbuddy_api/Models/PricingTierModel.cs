using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace eventbuddy_api.Models;

public class PricingTier
{
    [Key]
    public int Id { get; set; }
    public string Title { get; set; }
    public decimal Price { get; set; }
    public int EventId { get; set; }
    [JsonIgnore]
    public Event? Event { get; set; }
}