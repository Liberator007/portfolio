using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using News;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace News
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly ILogger<ArticleController> _logger;
        private NewsContext _context;
        public ArticleController(ILogger<ArticleController> logger, NewsContext context)
        {
            _logger = logger;
            _context = context;
        }

        [Route("getArticle")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public Article GetArticle([FromQuery] int articleID)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            Article article = articleFunctional.GetArticleByID(articleID);
            return article;
        }

        [Route("getArticleUserList")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleUserList()
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                IEnumerable<Article> listArticle = articleFunctional.GetArticleUserList(username);
                return listArticle;
            }
            else
            {
                return null;
            }
        }

        [Route("getArticleList")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleListAll()
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            List<Article> listArticle = articleFunctional.GetArticleList().ToList();
            return listArticle;
        }

        [Route("getArticleListAllStatusReleaseTrue")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleListAllStatusReleaseTrue()
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            List<Article> listArticle = articleFunctional.GetArticleListAllStatusReleaseTrue().ToList();
            return listArticle;
        }

        [Route("getArticleListSearchName")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleListSearchName([FromQuery] string search)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            List<Article> listArticle = articleFunctional.GetArticleListSearchName(search).ToList();
            return listArticle;
        }

        [Route("getArticleListByTopicID")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleListByTopicID([FromQuery] int topicID)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            List<Article> listArticle = articleFunctional.GetArticleListByTopicID(topicID).ToList();
            return listArticle;
        }

        // Добавление Новости
        [Authorize(Roles = "admin")]
        [Route("addArticle")]
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Article> AddArticle()
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    int userID = _context.User.FirstOrDefault(user => user.Username == username).UserID;
                    int articalID;
                    int previewID;
                    PreviewFunctional previewFunctional = new PreviewFunctional(_context);
                    ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                    previewID = previewFunctional.CreatePreview();
                    articalID = articleFunctional.CreateArticle(userID, previewID);
                    return CreatedAtAction(nameof(articalID), new { id = articalID }, articalID);
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        // Редактирование новости
        [Authorize(Roles = "admin")]
        [Route("updateArticle")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Article> UpdateArticle([FromBody] Article article)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                    articleFunctional.UpdateArticle(article);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        // Удаление Новости
        [Authorize(Roles = "admin")]
        [Route("deleteArticle")]
        [HttpDelete]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Article> DeleteArticle([FromQuery] int articleID)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                    articleFunctional.DeleteArticle(articleID);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        // Блокировка разблокировка новости
        [Authorize(Roles = "admin")]
        [Route("editBanArticle")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<User> EditBanArticle([FromQuery] int articleID)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                    articleFunctional.EditBanArticle(articleID);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        // Публикация новости
        [Authorize(Roles = "admin")]
        [Route("releaseArticle")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Article>> ReleaseArticle([FromQuery] int articleID)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    IUrlHelper url = Url;
                    string scheme = HttpContext.Request.Scheme;
                    ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                    await articleFunctional.ReleaseArticle(url, scheme, articleID);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        [Route("getTopicList")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Topic> GetTopicList()
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            IEnumerable<Topic> listTopic = articleFunctional.GetTopicList();
            return listTopic;
        }

        [Route("getTopic")]
        [HttpGet]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public Topic GetTopic([FromQuery] int topicID)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            Topic topic = articleFunctional.GetTopic(topicID);
            return topic;
        }

        // Добавление темы
        [Authorize(Roles = "admin")]
        [Route("createTopic")]
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Topic> CreateTopic([FromBody] Topic topic)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                    articleFunctional.CreateTopic(topic);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        // Удаление Темы
        [Authorize(Roles = "admin")]
        [Route("deleteTopic")]
        [HttpDelete]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Topic> DeleteTopic([FromQuery] int topicID)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                if (username != null)
                {
                    ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                    articleFunctional.DeleteTopic(topicID);
                    return Ok();
                }
                else
                {
                    return StatusCode(401);
                }
            }
            return BadRequest();
        }

        //------Получение опубликованных/неопубликованных новостей--------------------------------------------------------------------------------------------------------------------------------------

        [Authorize(Roles = "admin")]
        [Route("getArticleSortStatusRelease")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleSortStatusRelease([FromQuery] bool release)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            IEnumerable<Article> listArticle = articleFunctional.GetArticleSortStatusRelease(release);
            return listArticle;
        }

        [Authorize(Roles = "admin")]
        [Route("getArticleUserSortStatusRelease")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleUserSortStatusRelease([FromQuery] bool release)
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                IEnumerable<Article> listArticle = articleFunctional.GetArticleUserSortStatusRelease(username, release);
                return listArticle;
            }
            else
            {
                return null;
            }
        }

        //------Сортировка всех новостей--------------------------------------------------------------------------------------------------------------------------------------
        [Route("getArticleSortID")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleSortID([FromQuery] bool sort)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            IEnumerable<Article> listArticle = articleFunctional.GetArticleSortID(sort);
            return listArticle;
        }

        [Route("getArticleSortDateRelease")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleSortDateRelease([FromQuery] bool sort)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            IEnumerable<Article> listArticle = articleFunctional.GetArticleSortDateRelease(sort);
            return listArticle;
        }

        //------Сортировка новостей определенного пользователя--------------------------------------------------------------------------------------------------------------------------------------
        [Authorize(Roles = "admin")]
        [Route("getArticleUserSortID")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleUserSortID([FromQuery] bool sort)
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                IEnumerable<Article> listArticle = articleFunctional.GetArticleUserSortID(username, sort);
                return listArticle;
            }
            else
            {
                return null;
            }
        }

        [Authorize(Roles = "admin")]
        [Route("getArticleUserSortDateRelease")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleUserSortDateRelease([FromQuery] bool sort)
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                IEnumerable<Article> listArticle = articleFunctional.GetArticleUserSortDateRelease(username, sort);
                return listArticle;
            }
            else
            {
                return null;
            }
        }

        //------Сортировка пользователей и тем--------------------------------------------------------------------------------------------------------------------------------------
        [Route("getUserSortID")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<User> GetUserSortID([FromQuery] bool sort)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            IEnumerable<User> listUser = articleFunctional.GetUserSortID(sort);
            return listUser;
        }

        [Route("getTopicSortID")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Topic> GetTopicSortID([FromQuery] bool sort)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            IEnumerable<Topic> listTopic = articleFunctional.GetTopicSortID(sort);
            return listTopic;
        }

        //------Фильтры поиска сопадений в полю Name --------------------------------------------------------------------------------------------------------------------------------------
        [Route("getArticleSearch")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleSearch([FromQuery] string search)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            IEnumerable<Article> listArticle = articleFunctional.GetArticleSearch(search);
            return listArticle;
        }

        [Authorize(Roles = "admin")]
        [Route("getArticleUserSearch")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Article> GetArticleUserSearch([FromQuery] string search)
        {
            string username = User.Identity.Name;
            if (username != null)
            {
                ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                IEnumerable<Article> listArticle = articleFunctional.GetArticleUserSearch(username, search);
                return listArticle;
            }
            else
            {
                return null;
            }
        }

        [Route("getUserSearch")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<User> GetUserSearch([FromQuery] string search)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            IEnumerable<User> listUser = articleFunctional.GetUserSearch(search);
            return listUser;
        }

        [Route("getTopicSearch")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<Topic> GetTopicSearch([FromQuery] string search)
        {
            ArticleFunctional articleFunctional = new ArticleFunctional(_context);
            IEnumerable<Topic> listTopic = articleFunctional.GetTopicSearch(search);
            return listTopic;
        }
    }
}
