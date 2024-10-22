namespace eventbuddy_api.ViewModels;

public class TicketPurchaseRequest
{
    public required int UserId { get; set; }
    public required int EventId { get; set; }
}