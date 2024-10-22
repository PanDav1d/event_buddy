using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

namespace eventbuddy_api.Models;

public class Ticket
{
    [Key]
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public int EventId { get; set; }
    [JsonIgnore]
    public Event? Event { get; set; } = null;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UsedAt { get; set; }
    public string? QRCode { get; set; }
    public bool IsValid { get; set; } = true;
    public DateTime? ResoldAt { get; set; }
    public int? PreviousOwnerId { get; set; }
    public string? SecurityHash { get; set; }
    public Guid UniqueIdentifier { get; set; } = Guid.NewGuid();
    public void GenerateQRCode()
    {
        var data = $"{Id}-{OwnerId}-{EventId}-{UniqueIdentifier}-{DateTime.UtcNow.Ticks}";
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(data));
            QRCode = Convert.ToBase64String(hashBytes);
        }
        SecurityHash = UpdateSecurityHash();
    }

    public void Resell(int newOwnerId)
    {
        PreviousOwnerId = OwnerId;
        OwnerId = newOwnerId;
        ResoldAt = DateTime.Now;
        IsValid = true;
        UniqueIdentifier = Guid.NewGuid();
        GenerateQRCode();
    }

    private string UpdateSecurityHash()
    {
        var securityData = $"{Id}-{OwnerId}-{EventId}-{QRCode}-{IsValid}-{UniqueIdentifier}";
        using (HMACSHA512 hmac = new HMACSHA512(Encoding.UTF8.GetBytes("YourSecretKey")))
        {
            byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(securityData));
            return Convert.ToBase64String(hashBytes);
        }
    }

    public bool VerifyTicket()
    {
        return UpdateSecurityHash() == SecurityHash && IsValid;
    }
}
