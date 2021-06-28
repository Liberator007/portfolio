using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace News
{
    [Route("api/[controller]")]
    [ApiController]
    public class RateCommentController : ControllerBase
    {
        private readonly ILogger<RateCommentController> _logger;
        private NewsContext _context;
        public RateCommentController(ILogger<RateCommentController> logger, NewsContext context)
        {
            _logger = logger;
            _context = context;
        }

        // Получение оценки всех комментариев оперделенного пользователя
        [Authorize(Roles = "user, admin")]
        [Route("getListRateCommentUser")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<RateComment> GetListRateCommentUser(int articleID)
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                RateCommentFunctional rateCommentFunctional = new RateCommentFunctional(_context);
                List<RateComment> listRateComment = rateCommentFunctional.GetListRateCommentUser(articleID, username).ToList();
                return listRateComment;
            }
            else
            {
                return null;
            }
        }

        // Получение оценки всех комментариев
        [Route("getRateCommentList")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<RateSumCommet> GetRateCommentList(int articleID)
        {
            RateCommentFunctional rateCommentFunctional = new RateCommentFunctional(_context);
            List<RateSumCommet> listRateSumCommet = rateCommentFunctional.GetRateCommentList(articleID).ToList();
            return listRateSumCommet;
        }

        // Изменение лайка
        [Authorize(Roles = "user, admin")]
        [Route("changeLike")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<RateComment> ChangeLike([FromQuery] int commentID)
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                RateCommentFunctional rateCommentFunctional = new RateCommentFunctional(_context);
                rateCommentFunctional.ChangeLike(commentID, username);
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
        public ActionResult<RateComment> ChangeDislike([FromQuery] int commentID)
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                RateCommentFunctional rateCommentFunctional = new RateCommentFunctional(_context);
                rateCommentFunctional.ChangeDislike(commentID, username);
                return Ok();
            }
            else
            {
                return StatusCode(401);
            }
        }
    }
}
