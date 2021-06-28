using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace News
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class RateArticleController : ControllerBase
    {
        private readonly ILogger<RateArticleController> _logger;
        private NewsContext _context;
        public RateArticleController(ILogger<RateArticleController> logger, NewsContext context)
        {
            _logger = logger;
            _context = context;
        }

        // Получение оценки всех новостей
        [Route("getRateArticleList")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<RateSumArticle> GetRateArticleList()
        {
            RateArticleFunctional rateArticleFunctional = new RateArticleFunctional(_context);
            List<RateSumArticle> listRateArticle = rateArticleFunctional.GetRateArticleList().ToList();
            return listRateArticle;
        }

        // Получение оценки одной новости
        [Route("getRateArticle")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public RateSumArticle GetRateArticle([FromQuery] int articleID)
        {
            RateArticleFunctional rateArticleFunctional = new RateArticleFunctional(_context);
            RateSumArticle rateArticle = rateArticleFunctional.GetRateArticle(articleID);
            return rateArticle;
        }

        // Получение оценки новости конкретным пользователем
        [Authorize(Roles = "user, admin")]
        [Route("getRateArticleUser")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public RateArticle GetRateArticleUser([FromQuery] int articleID)
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                RateArticleFunctional rateArticleFunctional = new RateArticleFunctional(_context);
                RateArticle rateArticle = rateArticleFunctional.GetRateArticleUser(articleID, username);
                return rateArticle;
            }
            else
            {
                return null;
            }
        }

        // Изменение лайка
        [Authorize(Roles = "user, admin")]
        [Route("changeLike")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<RateArticle> ChangeLike([FromQuery] int articleID)
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                RateArticleFunctional rateArticleFunctional = new RateArticleFunctional(_context);
                rateArticleFunctional.ChangeLike(articleID, username);
                return Ok();
            }
            else
            {
                return StatusCode(401);
            }
        }

        // Изменение дизлайка
        [Authorize(Roles = "user, admin")]
        [Route("changeDislike")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<RateArticle> ChangeDislike([FromQuery] int articleID)
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                RateArticleFunctional rateArticleFunctional = new RateArticleFunctional(_context);
                rateArticleFunctional.ChangeDislike(articleID, username);
                return Ok();
            }
            else
            {
                return StatusCode(401);
            }
        }
    }
}
