using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;

namespace ConnectApi.Services;

public class EmailSender : IEmailSender
{
    private readonly ILogger _logger;
    private readonly AuthMessageSenderOptions _options;

    public EmailSender(
        IOptions<AuthMessageSenderOptions> optionsAccessor,
        ILogger<EmailSender> logger
    )
    {
        _options = optionsAccessor.Value;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        if (string.IsNullOrEmpty(_options.SmtpHost))
        {
            throw new Exception("SMTP host is not configured.");
        }

        await Execute(subject, message, toEmail);
    }

    public async Task Execute(string subject, string message, string toEmail)
    {
        var client = new SmtpClient(_options.SmtpHost, _options.SmtpPort)
        {
            Credentials = new NetworkCredential(_options.SmtpUsername, _options.SmtpPassword),
            EnableSsl = _options.EnableSsl
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress("connect.app.by.van@gmail.com", "Connect"),
            Subject = subject,
            IsBodyHtml = true,
            Body =
                $@"
            

<html>

<head>
    <title>Connect</title>
    <style>
        body {{
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #000;
            margin: 0;
            padding: 0;
        }}

        .container {{
            max-width: 600px;
            margin: 5px auto;
            border: 1px solid #f5f5f5;
            border-radius: 6px;
            overflow: hidden;
            background-color: #ffffff;
        }}

        header {{
            color: #000;
            padding: 20px;
            text-align: center;
        }}
        
        header img {{
            background-color: #f5f5f5;
            padding: 8px;
            border-radius: 8px;
        }}

        .content {{
            padding: 0px 0px 0px 0px;
            text-align: center;
        }}

        .content h3 {{
            font-size: 30px;
            color: #000;
        }}

        .content p {{
            font-size: 16px;   
            color: #737373;
        }}

        .disregard {{
            padding-bottom: 10px;
            text-align: center;
        }}

        .disregard p {{
            font-size: 16px;    
            color: #737373;
        }}

        footer {{
            color: #000;
            padding: 20px;
            text-align: center;
        }}

        footer p {{
            margin: 10px 0;
            font-size: 14px;
        }}
    </style>
</head>

<body>
    <div class='container'>
        <header>
            <img src='https://i.imgur.com/JQIYu84.png' alt='Logo'>
        </header>

        <div class='content'>
            <h3>{subject}</h3>
            <p>{message}</p>
        </div>

        <div class='disregard'>
            <p>If you did not request this process, please disregard the email.</p>
        </div>


        <footer>
            <p>&copy; 2023 Connect. All rights reserved.</p>
        </footer>
    </div>
</body>

</html>
        "
        };

        mailMessage.To.Add(toEmail);

        try
        {
            await client.SendMailAsync(mailMessage);
            _logger.LogInformation($"Email to {toEmail} sent successfully!");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to send email to {toEmail}: {ex.Message}");
        }
    }
}
