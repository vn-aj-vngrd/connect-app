namespace ConnectApi.Services;

public class AuthMessageSenderOptions
{
    // Add SMTP-related properties
    public string? SmtpHost { get; set; }
    public int SmtpPort { get; set; }
    public string? SmtpUsername { get; set; }
    public string? SmtpPassword { get; set; }
    public bool EnableSsl { get; set; }

    // Keep the existing SendGridKey property
    // public string? SendGridKey { get; set; }
}
