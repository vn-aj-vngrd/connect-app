using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class ChangePasswordRequest
{
    [Required(ErrorMessage = "Old password is required")]
    public string CurrentPassword { get; set; } = null!;

    [Required(ErrorMessage = "New password is required")]
    public string NewPassword { get; set; } = null!;
}
