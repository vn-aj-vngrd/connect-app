using System.Text;
using ConnectApi.Constants;
using ConnectApi.Context;
using ConnectApi.Entities;
using ConnectApi.Requests;
using ConnectApi.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace ConnectApi.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly IEmailSender<AppUser> _emailSender;
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _context;

    public AuthController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        IEmailSender<AppUser> emailSender,
        IConfiguration configuration,
        AppDbContext context
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _emailSender = emailSender;
        _configuration = configuration;
        _context = context;
    }

    // POST: /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new AppUser
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            Email = request.Email
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new { Message = "Registration failed", result.Errors });
        }

        await GenerateEmailConfirmationLinkAndSendEmailAsync(user);

        return CreatedAtAction(nameof(Register), new { Message = "Registration successful" });
    }

    // POST: /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByNameAsync(request.UserName);

        if (user == null)
        {
            return BadRequest(
                new { Message = "The username you entered isn’t connected to an account." }
            );
        }

        // check if the password is correct
        if (!await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return BadRequest(new { Message = "The password you’ve entered is incorrect." });
        }

        var result = await _signInManager.PasswordSignInAsync(
            request.UserName,
            request.Password,
            false,
            false
        );

        if (result.IsNotAllowed)
        {
            await GenerateEmailConfirmationLinkAndSendEmailAsync(user);

            return BadRequest(new { Message = "Email not confirmed" });
        }

        if (result.IsLockedOut)
        {
            return BadRequest(new { Message = "Sorry, but your account is currently disabled." });
        }

        if (!result.Succeeded)
        {
            return BadRequest(new { Message = "Something went wrong, please try again." });
        }

        return Ok(new { Message = "Login successful" });
    }

    // POST: /api/auth/logout
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();

        return Ok(new { Message = "Logout successful" });
    }

    // GET: /api/auth/confirm-email
    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(
        [FromQuery] string userId,
        [FromQuery] string code
    )
    {
        var FrontendUrl = $"http://{_configuration["AppHost"]}:3000";

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(code))
        {
            return Redirect(
                $"{FrontendUrl}/email-confirmation?title=Email Confirmation Failed&description=UserId and Code are required in the query parameters"
            );
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Redirect(
                $"{FrontendUrl}/email-confirmation?Title=&description=Sorry, we couldn't find your account"
            );
        }

        if (user.EmailConfirmed)
        {
            return Redirect(
                $"{FrontendUrl}/email-confirmation?title=Email Confirmation Failed&description=Your email has already been confirmed"
            );
        }

        var codeDecodedBytes = WebEncoders.Base64UrlDecode(code);
        var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);

        var result = await _userManager.ConfirmEmailAsync(user, codeDecoded);

        if (!result.Succeeded)
        {
            return Redirect(
                $"{FrontendUrl}/email-confirmation?title=Email Confirmation Failed&description=Sorry, we couldn't confirm your email. The link may have expired, please try again."
            );
        }

        return Redirect(
            $"{FrontendUrl}/email-confirmation?title=Email Confirmed&description=Your email has been confirmed successfully"
        );
    }

    // POST: /api/auth/forgot-password
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            return BadRequest(
                new { Message = "The email you entered isn’t connected to an account." }
            );
        }

        var passwordResetLink = await GenerateResetPasswordLinkAndSendEmailAsync(user);

        if (string.IsNullOrEmpty(passwordResetLink))
        {
            return BadRequest(new { Message = "Password reset failed" });
        }

        return Ok(new { Message = "Password reset link sent successfully" });
    }

    // GET: /api/auth/reset-password
    [HttpGet("reset-password")]
    public async Task<IActionResult> ResetPasswordLinkValidation(
        [FromQuery] string userId,
        [FromQuery] string code
    )
    {
        var FrontendUrl = $"http://{_configuration["AppHost"]}:3000";

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(code))
        {
            return Redirect(
                $"{FrontendUrl}/reset-password?title=Reset Password Failed&description=UserId and Code are required in the query parameters"
            );
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Redirect(
                $"{FrontendUrl}/reset-password?title=Reset Password Failed&description=Sorry, we couldn't find your account"
            );
        }

        var codeDecodedBytes = WebEncoders.Base64UrlDecode(code);
        var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);

        var result = await _userManager.VerifyUserTokenAsync(
            user,
            _userManager.Options.Tokens.PasswordResetTokenProvider,
            UserManager<AppUser>.ResetPasswordTokenPurpose,
            codeDecoded
        );

        if (!result)
        {
            return Redirect(
                $"{FrontendUrl}/reset-password?title=Reset Password Failed&description=Sorry, we couldn't reset your password. The link may have expired or has been used."
            );
        }

        return Redirect(
            $"{FrontendUrl}/reset-password?title=Reset Password&description=Please enter your new password. This link is valid for 15 minutes.&userId={userId}&code={code}"
        );
    }

    // POST: /api/auth/reset-password
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);

        if (user == null)
        {
            return BadRequest(new { Message = "User not found" });
        }

        var isOldPassword = await _userManager.CheckPasswordAsync(user, request.Password);

        if (isOldPassword)
        {
            return BadRequest(new { Message = "Please enter a new password." });
        }

        var codeDecodedBytes = WebEncoders.Base64UrlDecode(request.Code);
        var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);

        var result = await _userManager.ResetPasswordAsync(user, codeDecoded, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new { Message = "Password reset failed", Errors = result.Errors });
        }

        return Ok(new { Message = "Password reset successful" });
    }

    // POST: /api/auth/change-email
    [HttpPost("change-email"), Authorize]
    public async Task<IActionResult> ChangeEmail([FromBody] NewEmailRequest request)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user == null)
        {
            return BadRequest(new { Message = "User not found" });
        }

        if (user.Email == request.NewEmail)
        {
            return BadRequest(new { Message = "Please enter a new email." });
        }

        if (await _userManager.FindByEmailAsync(request.NewEmail) != null)
        {
            return BadRequest(new { Message = "Email already exists" });
        }

        var changeEmailLink = await GenerateChangeEmailLinkAndSendEmailAsync(
            user,
            request.NewEmail
        );

        if (string.IsNullOrEmpty(changeEmailLink))
        {
            return BadRequest(new { Message = "Email change failed" });
        }

        return Ok(new { Message = "Email change link sent successfully" });
    }

    // GET: /api/auth/change-email
    [HttpGet("change-email")]
    public async Task<IActionResult> ChangeEmailLinkValidation(
        [FromQuery] string userId,
        [FromQuery] string newEmail,
        [FromQuery] string code
    )
    {
        var FrontendUrl = $"http://{_configuration["AppHost"]}:3000";

        if (
            string.IsNullOrEmpty(userId)
            || string.IsNullOrEmpty(newEmail)
            || string.IsNullOrEmpty(code)
        )
        {
            return Redirect(
                $"{FrontendUrl}/email-confirmation?title=Change Email Failed&description=UserId, NewEmail and Code are required in the query parameters"
            );
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Redirect(
                $"{FrontendUrl}/email-confirmation?title=Change Email Failed&description=Sorry, we couldn't find your account"
            );
        }

        var codeDecodedBytes = WebEncoders.Base64UrlDecode(code);
        var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);

        var result = await _userManager.VerifyUserTokenAsync(
            user,
            _userManager.Options.Tokens.ChangeEmailTokenProvider,
            UserManager<AppUser>.GetChangeEmailTokenPurpose(newEmail),
            codeDecoded
        );

        if (!result)
        {
            return Redirect(
                $"{FrontendUrl}/email-confirmation?title=Change Email Failed&description=Sorry, we couldn't change your email. The link may have expired or has been used."
            );
        }

        user.Email = newEmail;

        var updateResult = await _userManager.UpdateAsync(user);

        if (!updateResult.Succeeded)
        {
            return Redirect(
                $"{FrontendUrl}/email-confirmation?title=Change Email Failed&description=Sorry, we couldn't change your email. Please try again."
            );
        }

        return Redirect(
            $"{FrontendUrl}/email-confirmation?title=Email Changed&description=Your email has been changed successfully"
        );
    }

    // GET: /api/auth/user
    [HttpGet("user"), Authorize]
    public async Task<ActionResult<UserResponse>> GetUser()
    {
        var user = await _userManager.GetUserAsync(User);

        if (user == null)
        {
            return BadRequest(new { Message = "User not found" });
        }

        return Ok(
            new UserResponse
            {
                Image = user.Image,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email
            }
        );
    }

    // PUT: /api/auth/user
    [HttpPut("user"), Authorize]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest request)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user == null)
        {
            return BadRequest(new { Message = "User not found" });
        }

        if (request.Image != null && request.Image.Length > AppConstants.MaxImageSize)
        {
            return BadRequest("Image size cannot exceed 1MB");
        }

        user.Image = request.Image;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.UserName = request.UserName;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(new { Message = "User update failed", Errors = result.Errors });
        }

        return Ok(new { Message = "User updated successfully" });
    }

    // PUT: /api/auth/change-password
    [HttpPut("change-password"), Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user == null)
        {
            return BadRequest(new { Message = "User not found" });
        }

        var isOldPassword = await _userManager.CheckPasswordAsync(user, request.NewPassword);

        if (isOldPassword)
        {
            return BadRequest(new { Message = "Please enter a new password." });
        }

        var result = await _userManager.ChangePasswordAsync(
            user,
            request.CurrentPassword,
            request.NewPassword
        );

        if (!result.Succeeded)
        {
            return BadRequest(new { Message = "Password change failed", Errors = result.Errors });
        }

        // Update the security stamp
        await _userManager.UpdateSecurityStampAsync(user);

        return Ok(new { Message = "Password changed successfully" });
    }

    // POST: /api/auth/delete-account
    [HttpPost("delete-account"), Authorize]
    public async Task<IActionResult> DeleteUser([FromBody] DeleteAccountRequest request)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user == null)
        {
            return BadRequest(new { Message = "User not found" });
        }

        var result = await _userManager.CheckPasswordAsync(user, request.Password);

        if (!result)
        {
            return BadRequest(new { Message = "Password entered is incorrect" });
        }

        // Remove all contacts
        var contacts = _context.Contacts.Where(c => c.AppUserId == user.Id).ToList();
        _context.RemoveRange(contacts);

        // Remove all contact tags
        var tags = _context.Tags.Where(t => t.AppUserId == user.Id).ToList();
        _context.RemoveRange(tags);

        // Remove user
        _context.Remove(user);

        await _context.SaveChangesAsync();

        return Ok(new { Message = "Account deleted successfully" });
    }

    private async Task<string> GenerateEmailConfirmationLinkAndSendEmailAsync(AppUser user)
    {
        var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(emailToken);
        var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

        var confirmationLink = Url.Action(
            "ConfirmEmail",
            "Auth",
            new { userId = user.Id, code = codeEncoded },
            protocol: HttpContext.Request.Scheme
        );

        await _emailSender.SendConfirmationLinkAsync(user, user.Email!, confirmationLink!);

        return confirmationLink!;
    }

    private async Task<string> GenerateResetPasswordLinkAndSendEmailAsync(AppUser user)
    {
        var passwordResetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(passwordResetToken);
        var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

        var passwordResetLink = Url.Action(
            "ResetPassword",
            "Auth",
            new { userId = user.Id, code = codeEncoded },
            protocol: HttpContext.Request.Scheme
        );

        await _emailSender.SendPasswordResetLinkAsync(user, user.Email!, passwordResetLink!);

        return passwordResetLink!;
    }

    private async Task<string> GenerateChangeEmailLinkAndSendEmailAsync(
        AppUser user,
        string newEmail
    )
    {
        var emailToken = await _userManager.GenerateChangeEmailTokenAsync(user, newEmail);
        byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(emailToken);
        var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

        var changeEmailLink = Url.Action(
            "ChangeEmail",
            "Auth",
            new
            {
                userId = user.Id,
                newEmail,
                code = codeEncoded
            },
            protocol: HttpContext.Request.Scheme
        );

        await _emailSender.SendConfirmationLinkAsync(user, newEmail, changeEmailLink!);

        return changeEmailLink!;
    }
}
