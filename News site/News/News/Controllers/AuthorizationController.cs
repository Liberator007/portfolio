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
    [Route("api/[controller]")]
    public class AuthorizationController : Controller
    {
        private readonly ILogger<AuthorizationController> _logger;

        private NewsContext _context;
        public AuthorizationController(ILogger<AuthorizationController> logger, NewsContext context)
        {
            _logger = logger;
            _context = context;
        }

        [Route("authorization")]
        [HttpPost]
        [AllowAnonymous]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<TokenObject>> Authorization([FromBody]User user)
        {
            if (ModelState.IsValid)
            {
                LoginRegistryFunctional loginRegistryFunctional = new LoginRegistryFunctional(_context);
                TokenObject tokenObject = await loginRegistryFunctional.Authorization(user);
                if (tokenObject == null)
                {
                    return StatusCode(401);
                }
                return tokenObject;
            }
            return BadRequest();
        }

        // Вывод всех пользователей
        [Route("getUser")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<UserAccess> GetUser()
        {
            LoginRegistryFunctional loginRegistryFunctional = new LoginRegistryFunctional(_context);
            List<UserAccess> listUserAccess = loginRegistryFunctional.GetUser().ToList();
            return listUserAccess;
        }

        // Блокировка разблокиовкак пользователя
        [Authorize(Roles = "admin")]
        [Route("editBanUser")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<User> EditBanUser([FromQuery] int userID)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    LoginRegistryFunctional loginRegistryFunctional = new LoginRegistryFunctional(_context);
                    loginRegistryFunctional.EditBanUser(userID);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        // Блокировка разблокиовкак пользователя
        [Authorize(Roles = "admin, user")]
        [Route("checkAuthorization")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<User> CheckAuthorization()
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                return Ok();
            }
            else
            {
                return StatusCode(401);
            }
        }
    }
}
