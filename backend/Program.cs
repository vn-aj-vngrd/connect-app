using ConnectApi.Context;
using ConnectApi.Entities;
using ConnectApi.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var APP_HOST = "AppHost";

var builder = WebApplication.CreateBuilder(args);

builder
    .Services
    .AddCors(options =>
    {
        options.AddPolicy(
            name: MyAllowSpecificOrigins,
            policy =>
            {
                policy
                    .WithOrigins(
                        "http://localhost:3000",
                        $"http://{builder.Configuration[APP_HOST]}:3000"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            }
        );
    });

builder
    .Services
    .AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft
            .Json
            .ReferenceLoopHandling
            .Ignore;
    });

builder
    .Services
    .AddDbContext<AppDbContext>(options =>
    {
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    });

builder
    .Services
    .AddIdentityCore<AppUser>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddApiEndpoints();

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthorization();

// Email Services

builder
    .Services
    .Configure<AuthMessageSenderOptions>(
        builder.Configuration.GetSection("AuthMessageSenderOptions")
    );

builder.Services.AddTransient<IEmailSender, EmailSender>();

// builder
//     .Services
//     .ConfigureApplicationCookie(options =>
//     {
//         options.ExpireTimeSpan = TimeSpan.FromDays(1);
//         options.SlidingExpiration = true;
//     });

builder
    .Services
    .Configure<DataProtectionTokenProviderOptions>(
        options => options.TokenLifespan = TimeSpan.FromMinutes(15)
    );

builder
    .Services
    .Configure<IdentityOptions>(options =>
    {
        options.SignIn.RequireConfirmedEmail = true;
        options.User.RequireUniqueEmail = true;
    });

builder
    .Services
    .AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies()
    .ApplicationCookie!
    .Configure(options =>
    {
        options.Events = new CookieAuthenticationEvents()
        {
            OnRedirectToLogin = ctx =>
            {
                ctx.Response.StatusCode = 401;
                return Task.CompletedTask;
            }
        };
        options.ExpireTimeSpan = TimeSpan.FromDays(1);
        options.SlidingExpiration = true;
        options.Cookie.HttpOnly = true;
        options.Cookie.Domain = "http://192.168.1.3";
        options.Cookie.Path = "/";
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.None;
    });

// Force Identity's security stamp to be validated every minute.
builder
    .Services
    .Configure<SecurityStampValidatorOptions>(o => o.ValidationInterval = TimeSpan.FromMinutes(1));

builder.Services.AddAuthorizationBuilder();
var app = builder.Build();

// app.MapIdentityApi<AppUser>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
