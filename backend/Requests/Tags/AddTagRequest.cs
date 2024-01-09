using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class AddTagRequest
{
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = string.Empty;
}
