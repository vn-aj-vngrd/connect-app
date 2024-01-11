using System.Security.Claims;
using ConnectApi.Constants;
using ConnectApi.Context;
using ConnectApi.Entities;
using ConnectApi.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConnectApi.Controllers;

[Route("api/tags"), Authorize]
[ApiController]
public class TagsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TagsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Tags
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tag>>> GetTag()
    {
        var tag = await _context
            .Tags
            .Where(t => t.AppUserId == User.FindFirstValue(ClaimTypes.NameIdentifier))
            .OrderBy(t => t.Name)
            .ToListAsync();

        if (tag == null)
        {
            return NotFound();
        }

        return tag;
    }

    // GET: api/Tags/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Tag>> GetTag(long id)
    {
        var tag = await _context.Tags.FindAsync(id);

        if (tag == null || tag.AppUserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            return NotFound();
        }

        return tag;
    }

    // PUT: api/Tags/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTag(long id, UpdateTagRequest request)
    {
        if (id != request.Id)
        {
            return BadRequest();
        }

        var tag = await _context.Tags.FindAsync(id);

        if (tag == null || tag.AppUserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            return NotFound();
        }

        if (
            await _context
                .Tags
                .AnyAsync(
                    t =>
                        t.Name == request.Name
                        && t.AppUserId == User.FindFirstValue(ClaimTypes.NameIdentifier)
                )
        )
        {
            return BadRequest(new { message = "Tag name already exists" });
        }

        tag.Name = request.Name[0].ToString().ToUpper() + request.Name[1..];
        tag.UpdatedAt = DateTime.UtcNow;

        _context.Entry(tag).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TagExists(id))
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

    // POST: api/Tags
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Tag>> PostTag(AddTagRequest tag)
    {
        var tagCount = await _context
            .Tags
            .Where(c => c.AppUserId == User.FindFirstValue(ClaimTypes.NameIdentifier))
            .CountAsync();

        if (tagCount >= AppConstants.MaxTagCount)
        {
            return BadRequest("You have reached the maximum number of tags.");
        }

        if (await _context.Tags.AnyAsync(t => t.Name == tag.Name))
        {
            return BadRequest(new { message = "Tag name already exists" });
        }

        var newTag = new Tag
        {
            Name = tag.Name[0].ToString().ToUpper() + tag.Name[1..],
            AppUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)
        };

        _context.Tags.Add(newTag);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTag", new { id = newTag.Id }, newTag);
    }

    // DELETE: api/Tags/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTag(long id)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null || tag.AppUserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            return NotFound();
        }

        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TagExists(long id)
    {
        return _context.Tags.Any(e => e.Id == id);
    }
}
