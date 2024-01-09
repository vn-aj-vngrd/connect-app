using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class LoginRequest
{
    [Required(ErrorMessage = "Username is required")]
    public string UserName { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = null!;
}
