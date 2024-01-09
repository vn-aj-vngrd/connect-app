using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class UpdateTagRequest
{
    [Required(ErrorMessage = "Id is required")]
    public long Id { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = string.Empty;
}
