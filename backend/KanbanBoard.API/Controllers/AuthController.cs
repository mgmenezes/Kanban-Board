namespace KanbanBoard.API.Controllers;

using KanbanBoard.API.DTOs;
using KanbanBoard.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Register(UserRegistrationDto registrationDto)
    {
        try
        {
            var user = await _authService.RegisterAsync(
                registrationDto.UserName,
                registrationDto.Email,
                registrationDto.Password
            );

            var (loggedInUser, token) = await _authService.LoginAsync(
                registrationDto.Email,
                registrationDto.Password
            );

            if (loggedInUser == null)
            {
                return BadRequest("Failed to login after registration.");
            }

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email
                }
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Login(UserLoginDto loginDto)
    {
        var (user, token) = await _authService.LoginAsync(loginDto.Email, loginDto.Password);

        if (user == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email
            }
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userId = GetCurrentUserId();
        var user = await _authService.GetUserByIdAsync(userId);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(new UserDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email
        });
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : Guid.Empty;
    }
}