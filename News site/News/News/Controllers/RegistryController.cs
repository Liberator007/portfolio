using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace News
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class RegistryController : Controller
    {
        private readonly ILogger<RegistryController> _logger;

        private NewsContext _context;
        public RegistryController(ILogger<RegistryController> logger, NewsContext context)
        {
            _logger = logger;
            _context = context;
        }

        [Route("registration")]
        [HttpPost]
        [AllowAnonymous]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<User>> Registration([FromBody]User user)
        {
            if (ModelState.IsValid)
            {
                DateTime dateCreate = DateTime.Now;

                user.Role = "user";
                user.Email = user.Email;
                user.EmailConfirmed = false;
                user.DateCreate = dateCreate;
                user.DateRegistration = null;
                user.Block = false;

                List<User> listUser = await _context.User.ToListAsync();
                foreach (User oneUser in listUser)
                {
                    if (oneUser.Username == user.Username)
                    {
                        return StatusCode(401);
                    }
                }

                _context.User.Add(user);
                _context.SaveChanges();

                IUrlHelper url = Url;
                string scheme = HttpContext.Request.Scheme;
                LoginRegistryFunctional loginRegistryFunctional = new LoginRegistryFunctional(_context);
                await loginRegistryFunctional.RegistrationWithEmail(url, scheme, user);

                return Ok();
            }
            return BadRequest();
        }

        [Authorize(Roles = "user")]
        [Route("confirmEmail")]
        [AllowAnonymous]
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> ConfirmEmail()
        {
            string username = User.Identity.Name;
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            if (user == null)
            {
                return BadRequest();
            }

            DateTime dateRegistration = DateTime.Now;
            user.EmailConfirmed = true;
            user.DateRegistration = dateRegistration;

            _context.User.Update(user);
            _context.SaveChanges();

            return Ok();
        }

        [Route("сreateUser")]
        [Authorize(Roles = "admin")]
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<User> CreateUser([FromBody] User user)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    List<User> listUser = _context.User.ToList();
                    foreach (User oneUser in listUser)
                    {
                        if (oneUser.Username == user.Username)
                        {
                            return StatusCode(401);
                        }
                    }
                    LoginRegistryFunctional loginRegistryFunctional = new LoginRegistryFunctional(_context);
                    loginRegistryFunctional.CreateUser(user);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }     
            }
            return BadRequest();
        }
    }
}
