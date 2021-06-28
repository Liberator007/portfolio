using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace News
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private readonly ILogger<SubscriptionController> _logger;
        private NewsContext _context;
        public SubscriptionController(ILogger<SubscriptionController> logger, NewsContext context)
        {
            _logger = logger;
            _context = context;
        }

        // Добавление подписки
        [Authorize(Roles = "user, admin")]
        [Route("createSubscription")]
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Subscription> CreateSubscription([FromQuery] int topicID)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    SubscriptionFunctional subscriptionFunctional = new SubscriptionFunctional(_context);
                    bool check = subscriptionFunctional.CreateSubscription(topicID, username);
                    if (!check)
                    {
                        return BadRequest();
                    }
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        // Удаление подписки
        [Authorize(Roles = "user, admin")]
        [Route("deleteSubscription")]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Subscription> DeleteSubscription([FromQuery] int subscriptionID)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    SubscriptionFunctional subscriptionFunctional = new SubscriptionFunctional(_context);
                    subscriptionFunctional.DeleteSubscription(subscriptionID);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        // Вывод всех подписок пользователя
        [Authorize(Roles = "user, admin")]
        [Route("getSubscriptionList")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Subscription> GetSubscriptionList()
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                SubscriptionFunctional subscriptionFunctional = new SubscriptionFunctional(_context);
                List<Subscription> listSubscription = subscriptionFunctional.GetSubscriptionList(username).ToList();
                return listSubscription;
            }
            return null;
        }
    }
}
