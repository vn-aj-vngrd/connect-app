using Microsoft.AspNetCore.Identity;

namespace ConnectApi.Entities;

public class AppUser : IdentityUser
{
    [PersonalData]
    public byte[]? Image { get; set; }

    [PersonalData]
    public string? FirstName { get; set; }

    [PersonalData]
    public string? LastName { get; set; }

    [PersonalData]
    public List<Contact> Contacts { get; } = new();
}
