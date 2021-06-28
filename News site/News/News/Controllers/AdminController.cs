using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using News;

namespace News
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class AdminController : Controller
    {
        private readonly ILogger<AdminController> _logger;
        private NewsContext _context;

        public AdminController(ILogger<AdminController> logger, NewsContext context)
        {
            _logger = logger;
            _context = context;
        }

        // Добавление Новости
        //[Authorize(Roles = "admin")]
        [Route("addArticle")]
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Article> AddArticle()
        {
            if (ModelState.IsValid)
            {
                int userID = 3; // Потом удалить
                int articalID;

                ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                //articalID = articleFunctional.CreateArticle(userID);
                articalID = 10;

                return CreatedAtAction(nameof(articalID), new { id = articalID }, articalID);
            }
            return BadRequest();


            //if (ModelState.IsValid)
            //{
            //    string nameUser = User.Identity.Name;
            //    if (nameUser != null)
            //    {
            //        List<User> userList = new List<User>();
            //        userList = _context.User.ToList();

            //        foreach (User user in userList)
            //        {
            //            if (user.Username == nameUser)
            //            {
            //                blog.User = user;
            //                blog.UserId = user.Id;
            //                _context.Blog.Add(blog);
            //                _context.SaveChanges();
            //            }
            //        }
            //        return Ok();
            //    }
            //    else
            //    {
            //        return StatusCode(401);
            //    }
            //}
            //return BadRequest();
        }

        // Добавление Изображения
        //[Authorize(Roles = "admin")]
        [Route("addImage")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<ImageDTO> AddImage([FromForm] ImageDTO imageDTO)
        {
            if (ModelState.IsValid)
            {
                if (imageDTO != null)
                {
                    string pathImageSave;
                    using (Stream stream = imageDTO.FormFile.OpenReadStream())
                    {
                        ImageOptimization imageOptimization = new ImageOptimization(stream);
                        pathImageSave = imageOptimization.VaryQualityLevel();
                    }

                    DateTime dateAddedImage = DateTime.Now;
                    Image image = new Image();

                    image.Path = pathImageSave;
                    image.DateAdded = dateAddedImage;
                    image.ArticleID = 3;

                    //_context.Image.Add(file);
                    //_context.SaveChanges();
                    return Ok();

                    //// путь к папке Files
                    //Random random = new Random();
                    //string folder = "Images";
                    ////string fileName = random.Next(1, 1000).ToString();
                    //string path = Path.Combine(Directory.GetCurrentDirectory(), folder, imageDTO.FileName);

                    //using (Stream stream = imageDTO.FormFile.OpenReadStream())
                    //{
                    //    ImageOptimization imageOptimization = new ImageOptimization(stream, path);
                    //    imageOptimization.VaryQualityLevel();
                    //}

                    //DateTime dateAddedImage = DateTime.Now;
                    //Image image = new Image();


                    //image.Path = path;
                    //image.Name = "Image";
                    //image.Description = "Image";
                    //image.DateAdded = dateAddedImage;
                    //image.ArticleID = 3;

                    ////_context.Image.Add(file);
                    ////_context.SaveChanges();
                    //return Ok();
                }
                return BadRequest();
            }
            return BadRequest();
        }

        // Получение Изображения
        //[Authorize(Roles = "admin")]
        [Route("getImage")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<FileStreamResult> GetImage([FromQuery] int articleID)
        {
            ImageDTO imageDTO = new ImageDTO();

            // путь к папке Files
            string folder = "Images";
            //string fileName = "imageText";
            //string path = Path.Combine(Directory.GetCurrentDirectory(), folder, fileName);
            string path = "";

            MemoryStream memoryStream = new MemoryStream();
            using (Stream stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memoryStream);
            }
            memoryStream.Position = 0;
            return File(memoryStream, "multipart/form-data", Path.GetFileName(path));
        }

        // Получение Изображения
        //[Authorize(Roles = "admin")]
        [Route("getImageSelectById")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<FileStreamResult> GetImageSelectById([FromQuery] int imageID)
        {
            FileStreamResult file;

            // путь к папке Files
            string folder = "Images";
            string fileName = "";

            switch (imageID)
            {
                case 1:
                    fileName = "imageText";
                    break;
                case 2:
                    fileName = "fileName";
                    break;
            }

            string path = Path.Combine(Directory.GetCurrentDirectory(), folder, fileName);

            MemoryStream memoryStream = new MemoryStream();
            using (Stream stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memoryStream);
            }
            memoryStream.Position = 0;
                        
            file = File(memoryStream, "multipart/form-data", Path.GetFileName(path));

            return file;
        }
    }
}
