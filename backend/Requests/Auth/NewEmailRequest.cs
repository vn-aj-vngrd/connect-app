using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class NewEmailRequest
{
    [Required(ErrorMessage = "NewEmail is required")]
    [EmailAddress(ErrorMessage = "NewEmail is not a valid email address")]
    public string NewEmail { get; set; } = null!;
}
