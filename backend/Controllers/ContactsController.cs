using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using ConnectApi.Constants;
using ConnectApi.Context;
using ConnectApi.Entities;
using ConnectApi.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConnectApi.Controllers;

[Route("api/contacts"), Authorize]
[ApiController]
public partial class ContactsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContactsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/contacts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Contact>>> GetContacts(
        [FromQuery] long? tagId = null,
        [FromQuery] string? search = null,
        [FromQuery] string? sortField = "FirstName", // Default sort field
        [FromQuery] bool sortDescending = false, // Default sort order
        [FromQuery] Dictionary<string, string>? filters = null, // Field-value pairs for filtering
        [FromQuery] int startingIndex = 0, // Page number
        [FromQuery] int limit = 10 // Number of items per page
    )
    {
        var query = _context
            .Contacts
            .Include(c => c.Tags)
            .Include(c => c.DeliveryAddress)
            .Include(c => c.BillingAddress)
            .Where(c => c.AppUserId == User.FindFirstValue(ClaimTypes.NameIdentifier));

        if (tagId != null)
        {
            query = query.Where(c => c.Tags.Any(t => t.Id == tagId));
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(
                c =>
                    c.FirstName.Contains(search)
                    || (c.LastName != null && c.LastName.Contains(search))
                    || (c.PhoneNumber != null && c.PhoneNumber.Contains(search))
                    || (c.Email != null && c.Email.Contains(search))
                    || (
                        c.DeliveryAddress != null
                        && c.DeliveryAddress.Country != null
                        && c.DeliveryAddress.Country.Contains(search)
                    )
                    || (
                        c.DeliveryAddress != null
                        && c.DeliveryAddress.Street != null
                        && c.DeliveryAddress.Street.Contains(search)
                    )
                    || (
                        c.DeliveryAddress != null
                        && c.DeliveryAddress.City != null
                        && c.DeliveryAddress.City.Contains(search)
                    )
                    || (
                        c.DeliveryAddress != null
                        && c.DeliveryAddress.PostalCode != null
                        && c.DeliveryAddress.PostalCode.Contains(search)
                    )
                    || (
                        c.DeliveryAddress != null
                        && c.DeliveryAddress.Province != null
                        && c.DeliveryAddress.Province.Contains(search)
                    )
                    || (
                        c.BillingAddress != null
                        && c.BillingAddress.Country != null
                        && c.BillingAddress.Country.Contains(search)
                    )
                    || (
                        c.BillingAddress != null
                        && c.BillingAddress.Street != null
                        && c.BillingAddress.Street.Contains(search)
                    )
                    || (
                        c.BillingAddress != null
                        && c.BillingAddress.City != null
                        && c.BillingAddress.City.Contains(search)
                    )
                    || (
                        c.BillingAddress != null
                        && c.BillingAddress.PostalCode != null
                        && c.BillingAddress.PostalCode.Contains(search)
                    )
                    || (
                        c.BillingAddress != null
                        && c.BillingAddress.Province != null
                        && c.BillingAddress.Province.Contains(search)
                    )
                    || (c.Website != null && c.Website.Contains(search))
                    || (c.Notes != null && c.Notes.Contains(search))
            );
        }

        if (filters != null)
        {
            query = ApplyFiltering(query, filters);
        }

        if (sortField != null)
        {
            query = ApplySorting(query, sortField, sortDescending);
        }

        var total = await query.CountAsync();

        query = query.Skip(startingIndex).Take(limit);

        var data = await query.ToListAsync();

        return Ok(
            new
            {
                data,
                total,
                startingIndex,
                limit,
            }
        );
    }

    // GET: api/contacts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Contact>> GetContact(long id)
    {
        var contact = await _context
            .Contacts
            .Include(c => c.Tags)
            .Include(c => c.DeliveryAddress)
            .Include(c => c.BillingAddress)
            .Where(c => c.Id == id)
            .FirstOrDefaultAsync();

        if (contact == null)
        {
            return NotFound();
        }

        return contact;
    }

    // PUT: api/contacts/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutContact(long id, EditContactRequest request)
    {
        if (id != request.Id)
        {
            return BadRequest();
        }

        var contact = await _context.Contacts.FindAsync(id);

        if (contact == null)
        {
            return NotFound();
        }

        if (contact.AppUserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            return Unauthorized();
        }

        if (request.Image != null && request.Image.Length > AppConstants.MaxImageSize)
        {
            return BadRequest("Image size cannot exceed 1MB");
        }

        contact.Image = request.Image;
        contact.FirstName = request.FirstName[0].ToString().ToUpper() + request.FirstName[1..];
        contact.LastName = request.LastName;
        contact.PhoneNumber = request.PhoneNumber;
        contact.Email = request.Email;
        contact.Website = request.Website;
        contact.Notes = request.Notes;
        contact.IsFavorite = request.IsFavorite;
        contact.UpdatedAt = DateTime.UtcNow;

        // find contactId in deliveryAddress table
        var deliveryAddress = await _context
            .DeliveryAddresses
            .Where(da => da.ContactId == id)
            .FirstOrDefaultAsync();

        if (deliveryAddress == null) // if not found, create new deliveryAddress
        {
            if (request.DeliveryAddress != null)
            {
                var newDeliveryAddress = new DeliveryAddress
                {
                    Country = request.DeliveryAddress.Country,
                    Street = request.DeliveryAddress.Street,
                    City = request.DeliveryAddress.City,
                    PostalCode = request.DeliveryAddress.PostalCode,
                    Province = request.DeliveryAddress.Province,
                    ContactId = id
                };

                _context.DeliveryAddresses.Add(newDeliveryAddress);
            }
        }
        else // if found, update deliveryAddress
        {
            if (request.DeliveryAddress != null)
            {
                deliveryAddress.Country = request.DeliveryAddress.Country;
                deliveryAddress.Country = request.DeliveryAddress.Country;
                deliveryAddress.Street = request.DeliveryAddress.Street;
                deliveryAddress.City = request.DeliveryAddress.City;
                deliveryAddress.PostalCode = request.DeliveryAddress.PostalCode;
                deliveryAddress.Province = request.DeliveryAddress.Province;
            }
        }

        // find contactId in billingAddress table

        var billingAddress = await _context
            .BillingAddresses
            .Where(ba => ba.ContactId == id)
            .FirstOrDefaultAsync();

        if (billingAddress == null) // if not found, create new billingAddress
        {
            if (request.BillingAddress != null)
            {
                var newBillingAddress = new BillingAddress
                {
                    Country = request.BillingAddress.Country,
                    Street = request.BillingAddress.Street,
                    City = request.BillingAddress.City,
                    PostalCode = request.BillingAddress.PostalCode,
                    Province = request.BillingAddress.Province,
                    ContactId = id
                };

                _context.BillingAddresses.Add(newBillingAddress);
            }
        }
        else // if found, update billingAddress
        {
            if (request.BillingAddress != null)
            {
                billingAddress.Country = request.BillingAddress.Country;
                billingAddress.Country = request.BillingAddress.Country;
                billingAddress.Street = request.BillingAddress.Street;
                billingAddress.City = request.BillingAddress.City;
                billingAddress.PostalCode = request.BillingAddress.PostalCode;
                billingAddress.Province = request.BillingAddress.Province;
            }
        }

        var contactTags = await _context.ContactTags.Where(ct => ct.ContactId == id).ToListAsync();
        _context.ContactTags.RemoveRange(contactTags);

        foreach (var tagId in request.TagIds)
        {
            var contactTag = new ContactTag { ContactId = id, TagId = tagId };

            _context.ContactTags.Add(contactTag);
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ContactExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/contacts
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Contact>> PostContact(AddContactRequest contact)
    {
        var contactCount = await _context
            .Contacts
            .Where(c => c.AppUserId == User.FindFirstValue(ClaimTypes.NameIdentifier))
            .CountAsync();

        if (contactCount >= AppConstants.MaxContactCount)
        {
            return BadRequest("You have reached the maximum number of contacts.");
        }

        if (contact.Image != null && contact.Image.Length > AppConstants.MaxImageSize)
        {
            return BadRequest("Image size cannot exceed 1MB");
        }

        var newContact = new Contact
        {
            Image = contact.Image,
            FirstName = contact.FirstName[0].ToString().ToUpper() + contact.FirstName[1..],
            LastName = contact.LastName,
            PhoneNumber = contact.PhoneNumber,
            Email = contact.Email,
            DeliveryAddress = contact.DeliveryAddress,
            BillingAddress = contact.BillingAddress,
            Website = contact.Website,
            Notes = contact.Notes,
            AppUserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            IsFavorite = contact.IsFavorite
        };

        _context.Contacts.Add(newContact);
        await _context.SaveChangesAsync();

        foreach (var tagId in contact.TagIds)
        {
            var contactTag = new ContactTag { ContactId = newContact.Id, TagId = tagId };

            _context.ContactTags.Add(contactTag);
        }
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetContact", new { id = newContact.Id }, newContact);
    }

    // PUT: api/contacts/5/favorite
    [HttpPut("{id}/favorite")]
    public async Task<IActionResult> ToggleFavorite(long id)
    {
        var contact = await _context.Contacts.FindAsync(id);

        if (contact == null)
        {
            return NotFound();
        }

        if (contact.AppUserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            return Unauthorized();
        }

        contact.IsFavorite = !contact.IsFavorite;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/contacts/favorite?ids=1&ids=2&ids=3
    [HttpPut("favorite")]
    public async Task<IActionResult> ToggleFavorites(
        [FromQuery] List<long>? ids = null, // List of contact IDs
        [FromQuery] bool isFavorite = false // Whether to set the contacts as favorite or not
    )
    {
        if (ids == null || ids.Count == 0)
        {
            return BadRequest("No contact IDs were provided.");
        }

        var contacts = await _context.Contacts.Where(c => ids.Contains(c.Id)).ToListAsync();

        if (contacts == null || contacts.Count == 0)
        {
            return NotFound("No contacts found.");
        }

        if (contacts.Any(c => c.AppUserId != User.FindFirstValue(ClaimTypes.NameIdentifier)))
        {
            return Unauthorized();
        }

        foreach (var contact in contacts)
        {
            contact.IsFavorite = isFavorite;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/contacts/tags?ids=1&ids=2&ids=3
    [HttpPut("tags")]
    public async Task<IActionResult> UpdateContactTags(
        UpdateContactTagsRequest request,
        [FromQuery] List<long>? ids = null // List of contact IDs
    )
    {
        if (ids == null || ids.Count == 0)
        {
            return BadRequest("No contact IDs were provided.");
        }

        var contacts = await _context.Contacts.Where(c => ids.Contains(c.Id)).ToListAsync();

        if (contacts == null || contacts.Count == 0)
        {
            return NotFound("No contacts found.");
        }

        if (contacts.Any(c => c.AppUserId != User.FindFirstValue(ClaimTypes.NameIdentifier)))
        {
            return Unauthorized();
        }

        var contactTags = await _context
            .ContactTags
            .Where(ct => ids.Contains(ct.ContactId))
            .ToListAsync();
        _context.ContactTags.RemoveRange(contactTags);

        foreach (var contact in contacts)
        {
            foreach (var tagId in request.TagIds)
            {
                var contactTag = new ContactTag { ContactId = contact.Id, TagId = tagId };

                _context.ContactTags.Add(contactTag);
            }
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/contacts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContact(long id)
    {
        var contact = await _context.Contacts.FindAsync(id);
        if (contact == null)
        {
            return NotFound();
        }

        _context.Contacts.Remove(contact);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/contacts/bulk?ids=1&ids=2&ids=3
    [HttpDelete("bulk")]
    public async Task<IActionResult> DeleteContacts(
        [FromQuery] List<long>? ids = null // List of contact IDs
    )
    {
        if (ids == null || ids.Count == 0)
        {
            return BadRequest("No contact IDs were provided.");
        }

        var contacts = await _context.Contacts.Where(c => ids.Contains(c.Id)).ToListAsync();

        if (contacts == null || contacts.Count == 0)
        {
            return NotFound("No contacts found.");
        }

        if (contacts.Any(c => c.AppUserId != User.FindFirstValue(ClaimTypes.NameIdentifier)))
        {
            return Unauthorized();
        }

        _context.Contacts.RemoveRange(contacts);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // EXPORT

    // GET: api/contacts/5/export
    [HttpGet("{id}/export")]
    public async Task<ActionResult<Contact>> ExportContact(long id)
    {
        var contact = await _context
            .Contacts
            .Include(c => c.DeliveryAddress)
            .Include(c => c.BillingAddress)
            .Where(c => c.Id == id && c.AppUserId == User.FindFirstValue(ClaimTypes.NameIdentifier))
            .Select(
                c =>
                    new
                    {
                        c.Image,
                        c.FirstName,
                        c.LastName,
                        c.PhoneNumber,
                        c.Email,
                        c.Website,
                        c.Notes,
                        c.IsFavorite,
                        c.CreatedAt,
                        c.UpdatedAt,
                        DeliveryAddress = c.DeliveryAddress != null
                            ? new
                            {
                                Country = c.DeliveryAddress.Country,
                                Street = c.DeliveryAddress.Street,
                                City = c.DeliveryAddress.City,
                                PostalCode = c.DeliveryAddress.PostalCode,
                                Province = c.DeliveryAddress.Province
                            }
                            : null,
                        BillingAddress = c.BillingAddress != null
                            ? new
                            {
                                Country = c.BillingAddress.Country,
                                Street = c.BillingAddress.Street,
                                City = c.BillingAddress.City,
                                PostalCode = c.BillingAddress.PostalCode,
                                Province = c.BillingAddress.Province
                            }
                            : null,
                        c.AppUserId
                    }
            )
            .FirstOrDefaultAsync();

        if (contact == null)
        {
            return NotFound("Contact not found.");
        }

        if (contact.AppUserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            return Unauthorized();
        }

        var json = JsonSerializer.Serialize(contact);
        json = "[" + json + "]";
        var byteArray = Encoding.UTF8.GetBytes(json);
        var contentDisposition = new ContentDispositionHeaderValue("attachment")
        {
            FileName = "contact-export.json"
        };
        Response.Headers.Append("Content-Disposition", contentDisposition.ToString());
        Response.Headers.Append("Content-Type", "application/json");

        return File(new MemoryStream(byteArray), "application/json");
    }

    // GET: api/contacts/export?ids=1&ids=2&ids=3
    [HttpGet("export")]
    public async Task<ActionResult<IEnumerable<Contact>>> ExportContacts(
        [FromQuery] List<long>? ids = null // List of contact IDs
    )
    {
        var query =
            ids == null || ids.Count == 0
                ? _context
                    .Contacts
                    .Include(c => c.DeliveryAddress)
                    .Include(c => c.BillingAddress)
                    .Where(c => c.AppUserId == User.FindFirstValue(ClaimTypes.NameIdentifier))
                    .Select(
                        c =>
                            new
                            {
                                c.Image,
                                c.FirstName,
                                c.LastName,
                                c.PhoneNumber,
                                c.Email,
                                c.Website,
                                c.Notes,
                                c.IsFavorite,
                                c.CreatedAt,
                                c.UpdatedAt,
                                DeliveryAddress = c.DeliveryAddress != null
                                    ? new
                                    {
                                        Country = c.DeliveryAddress.Country,
                                        Street = c.DeliveryAddress.Street,
                                        City = c.DeliveryAddress.City,
                                        PostalCode = c.DeliveryAddress.PostalCode,
                                        Province = c.DeliveryAddress.Province
                                    }
                                    : null,
                                BillingAddress = c.BillingAddress != null
                                    ? new
                                    {
                                        Country = c.BillingAddress.Country,
                                        Street = c.BillingAddress.Street,
                                        City = c.BillingAddress.City,
                                        PostalCode = c.BillingAddress.PostalCode,
                                        Province = c.BillingAddress.Province
                                    }
                                    : null,
                                c.AppUserId
                            }
                    )
                : _context
                    .Contacts
                    .Include(c => c.DeliveryAddress)
                    .Include(c => c.BillingAddress)
                    .Where(
                        c =>
                            ids.Contains(c.Id)
                            && c.AppUserId == User.FindFirstValue(ClaimTypes.NameIdentifier)
                    )
                    .Select(
                        c =>
                            new
                            {
                                c.Image,
                                c.FirstName,
                                c.LastName,
                                c.PhoneNumber,
                                c.Email,
                                c.Website,
                                c.Notes,
                                c.IsFavorite,
                                c.CreatedAt,
                                c.UpdatedAt,
                                DeliveryAddress = c.DeliveryAddress != null
                                    ? new
                                    {
                                        Country = c.DeliveryAddress.Country,
                                        Street = c.DeliveryAddress.Street,
                                        City = c.DeliveryAddress.City,
                                        PostalCode = c.DeliveryAddress.PostalCode,
                                        Province = c.DeliveryAddress.Province
                                    }
                                    : null,
                                BillingAddress = c.BillingAddress != null
                                    ? new
                                    {
                                        Country = c.BillingAddress.Country,
                                        Street = c.BillingAddress.Street,
                                        City = c.BillingAddress.City,
                                        PostalCode = c.BillingAddress.PostalCode,
                                        Province = c.BillingAddress.Province
                                    }
                                    : null,
                                c.AppUserId
                            }
                    );

        var contacts = await query.ToListAsync();

        if (contacts == null || contacts.Count == 0)
        {
            return NotFound("No contacts found.");
        }

        var json = JsonSerializer.Serialize(contacts);
        var byteArray = Encoding.UTF8.GetBytes(json);
        var contentDisposition = new ContentDispositionHeaderValue("attachment")
        {
            FileName = "contacts-export.json"
        };
        Response.Headers.Append("Content-Disposition", contentDisposition.ToString());
        Response.Headers.Append("Content-Type", "application/json");

        return File(new MemoryStream(byteArray), "application/json");
    }

    // IMPORT

    // POST: api/contacts/import
    [HttpPost("import")]
    public async Task<IActionResult> ImportContacts(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file was uploaded.");
        }

        var byteArray = new byte[file.Length];
        await file.OpenReadStream().ReadAsync(byteArray);
        var json = Encoding.UTF8.GetString(byteArray);
        var contacts = JsonSerializer.Deserialize<List<Contact>>(json);

        if (contacts == null || contacts.Count == 0)
        {
            return BadRequest("The file does not contain any contacts.");
        }

        foreach (var contact in contacts)
        {
            var newContact = new Contact
            {
                Image = contact.Image,
                FirstName = contact.FirstName,
                LastName = contact.LastName,
                PhoneNumber = contact.PhoneNumber,
                Email = contact.Email,
                Website = contact.Website,
                Notes = contact.Notes,
                IsFavorite = contact.IsFavorite,
                CreatedAt = contact.CreatedAt,
                UpdatedAt = contact.UpdatedAt,
                DeliveryAddress = contact.DeliveryAddress,
                BillingAddress = contact.BillingAddress,
                AppUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            };

            _context.Contacts.Add(newContact);
        }

        await _context.SaveChangesAsync();

        return Ok(contacts);
    }

    // HELPERS

    private bool ContactExists(long id)
    {
        return _context.Contacts.Any(e => e.Id == id);
    }

    private IQueryable<Contact> ApplyFiltering(
        IQueryable<Contact> query,
        Dictionary<string, string> filters
    )
    {
        if (filters != null && filters.Count > 0)
        {
            foreach (var (field, value) in filters)
            {
                switch (field.ToLower())
                {
                    case "firstname":
                        query = query.Where(c => c.FirstName.Contains(value));
                        break;
                    case "lastname":
                        query = query.Where(c => c.LastName != null && c.LastName.Contains(value));
                        break;
                    case "phonenumber":
                        query = query.Where(
                            c => c.PhoneNumber != null && c.PhoneNumber.Contains(value)
                        );
                        break;
                    case "email":
                        query = query.Where(c => c.Email != null && c.Email.Contains(value));
                        break;
                    case "deliveryaddress.country":
                        query = query.Where(
                            c =>
                                c.DeliveryAddress != null
                                && c.DeliveryAddress.Country != null
                                && c.DeliveryAddress.Country.Contains(value)
                        );
                        break;
                    case "deliveryaddress.street":
                        query = query.Where(
                            c =>
                                c.DeliveryAddress != null
                                && c.DeliveryAddress.Street != null
                                && c.DeliveryAddress.Street.Contains(value)
                        );
                        break;
                    case "deliveryaddress.city":
                        query = query.Where(
                            c =>
                                c.DeliveryAddress != null
                                && c.DeliveryAddress.City != null
                                && c.DeliveryAddress.City.Contains(value)
                        );
                        break;
                    case "deliveryaddress.postalcode":
                        query = query.Where(
                            c =>
                                c.DeliveryAddress != null
                                && c.DeliveryAddress.PostalCode != null
                                && c.DeliveryAddress.PostalCode.Contains(value)
                        );
                        break;
                    case "deliveryaddress.province":
                        query = query.Where(
                            c =>
                                c.DeliveryAddress != null
                                && c.DeliveryAddress.Province != null
                                && c.DeliveryAddress.Province.Contains(value)
                        );
                        break;
                    case "billingaddress.country":
                        query = query.Where(
                            c =>
                                c.BillingAddress != null
                                && c.BillingAddress.Country != null
                                && c.BillingAddress.Country.Contains(value)
                        );
                        break;
                    case "billingaddress.street":
                        query = query.Where(
                            c =>
                                c.BillingAddress != null
                                && c.BillingAddress.Street != null
                                && c.BillingAddress.Street.Contains(value)
                        );
                        break;

                    case "billingaddress.city":
                        query = query.Where(
                            c =>
                                c.BillingAddress != null
                                && c.BillingAddress.City != null
                                && c.BillingAddress.City.Contains(value)
                        );
                        break;
                    case "billingaddress.postalcode":
                        query = query.Where(
                            c =>
                                c.BillingAddress != null
                                && c.BillingAddress.PostalCode != null
                                && c.BillingAddress.PostalCode.Contains(value)
                        );
                        break;
                    case "billingaddress.province":
                        query = query.Where(
                            c =>
                                c.BillingAddress != null
                                && c.BillingAddress.Province != null
                                && c.BillingAddress.Province.Contains(value)
                        );
                        break;

                    case "website":
                        query = query.Where(c => c.Website != null && c.Website.Contains(value));
                        break;
                    case "notes":
                        query = query.Where(c => c.Notes != null && c.Notes.Contains(value));
                        break;
                    case "isfavorite":
                        query = query.Where(c => c.IsFavorite.ToString() == value);
                        break;
                    default:
                        break;
                }
            }
        }

        return query;
    }

    private IQueryable<Contact> ApplySorting(
        IQueryable<Contact> query,
        string sortField,
        bool sortDescending
    )
    {
        // Default sort field if the provided one is not valid
        if (
            string.IsNullOrEmpty(sortField)
            || sortField != "FirstName"
                && sortField != "LastName"
                && sortField != "PhoneNumber"
                && sortField != "Email"
                && sortField != "Website"
        )
        {
            sortField = "FirstName";
        }

        // Apply sorting based on the selected field and order
        if (sortDescending)
        {
            query = query.OrderByDescending(c => EF.Property<object>(c, sortField));
        }
        else
        {
            query = query.OrderBy(c => EF.Property<object>(c, sortField));
        }

        return query;
    }
}
