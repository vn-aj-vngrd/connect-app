using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class DeleteAccountRequest
{
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = null!;
}
