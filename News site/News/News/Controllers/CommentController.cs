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
    public class CommentController : ControllerBase
    {
        private readonly ILogger<CommentController> _logger;
        private NewsContext _context;
        public CommentController(ILogger<CommentController> logger, NewsContext context)
        {
            _logger = logger;
            _context = context;
        }

        // Получение комментария
        [Route("getComment")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public Comment GetComment([FromQuery] int commentID)
        {
            CommentFunctional commentFunctional = new CommentFunctional(_context);
            Comment comment = commentFunctional.GetComment(commentID);
            return comment;
        }

        // Добавление комментария
        [Authorize(Roles = "user, admin")]
        [Route("createComment")]
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Comment> CreateComment([FromBody] Comment comment)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                //string username = "AntonSaliava";
                if (username != null)
                {
                    CommentFunctional commentFunctional = new CommentFunctional(_context);
                    commentFunctional.CreateComment(comment, username);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        // Редактирование комментария
        [Authorize(Roles = "user, admin")]
        [Route("updateComment")]
        [AllowAnonymous]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Comment> UpdateComment([FromBody] Comment comment)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                //string username = "AntonSaliava";
                if (username != null)
                {
                    CommentFunctional commentFunctional = new CommentFunctional(_context);
                    commentFunctional.UpdateComment(comment);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        // Удаления комментария
        [Authorize(Roles = "user, admin")]
        [Route("deleteComment")]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Comment> DeleteComment([FromQuery] int commentID)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                //string username = "AntonSaliava";
                if (username != null)
                {
                    CommentFunctional commentFunctional = new CommentFunctional(_context);
                    commentFunctional.DeleteComment(commentID);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }

            }
            return BadRequest();
        }

        // Вывод всех комментариев одной статьи
        [Route("getCommentList")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Comment> GetCommentList([FromQuery] int articleID)
        {
            CommentFunctional commentFunctional = new CommentFunctional(_context);
            List<Comment> listComment = commentFunctional.GetCommentList(articleID).ToList();
            return listComment;
        }

        // Вывод всех пользователей которые оставили комментарии
        [Route("getUserComment")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<UserComment> GetUserComment([FromQuery] int articleID)
        {
            UserFunctional userFunctional = new UserFunctional(_context);
            List<UserComment> listUserComment = userFunctional.GetUserComment(articleID).ToList();
            return listUserComment;
        }

        // Вывод ID пользователя
        [Authorize(Roles = "admin, user")]
        [Route("getUserID")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public int? GetUserID()
        {
            string username = User.Identity.Name;
            //string username = "AntonSaliava";
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            if (user == null)
            {
                return null;
            }
            UserFunctional userFunctional = new UserFunctional(_context);
            int? userID = userFunctional.GetUserID(username);
            return userID;
        }
    }
}
