using ConnectApi.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ConnectApi.Context;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder
            .Entity<AppUser>()
            .HasMany(e => e.Contacts)
            .WithOne(e => e.AppUser)
            .HasForeignKey(e => e.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<Contact>()
            .HasMany(e => e.Tags)
            .WithMany(e => e.Contacts)
            .UsingEntity<ContactTag>();

        modelBuilder
            .Entity<Contact>()
            .HasOne(e => e.DeliveryAddress)
            .WithOne(e => e.Contact)
            .HasForeignKey<DeliveryAddress>(e => e.ContactId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<Contact>()
            .HasOne(e => e.BillingAddress)
            .WithOne(e => e.Contact)
            .HasForeignKey<BillingAddress>(e => e.ContactId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public DbSet<AppUser> AppUsers { get; set; } = default!;
    public DbSet<Contact> Contacts { get; set; } = default!;
    public DbSet<Tag> Tags { get; set; } = default!;
    public DbSet<ContactTag> ContactTags { get; set; } = default!;
    public DbSet<DeliveryAddress> DeliveryAddresses { get; set; } = default!;
    public DbSet<BillingAddress> BillingAddresses { get; set; } = default!;
}
