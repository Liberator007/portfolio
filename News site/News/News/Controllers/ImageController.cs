using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using News;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace News
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly ILogger<ImageController> _logger;
        private NewsContext _context;
        public ImageController(ILogger<ImageController> logger, NewsContext context)
        {
            _logger = logger;
            _context = context;
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
                    ImageFunctional imageFunctional = new ImageFunctional(_context);
                    if (imageFunctional.AddImage(imageDTO) != null)
                    {
                        return Ok();
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
                return BadRequest();
            }
            return BadRequest();

        }

        [Route("getImage")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<FileStreamResult> GetImage([FromQuery] int imageID)
        {
            string path;
            FileStreamResult file;
            ImageFunctional imageFunctional = new ImageFunctional(_context);
            path = await imageFunctional.PathImage(imageID);
            if (path != null)
            {
                MemoryStream memoryStream = await imageFunctional.GetImage(path);
                file = File(memoryStream, "multipart/form-data", Path.GetFileName(path));
                return file;
            }
            else
            {
                return null;
            }
        }

        [Route("getImageIdList")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IEnumerable<int> GetImageIdList([FromQuery] int articleID)
        {
            ImageFunctional imageFunctional = new ImageFunctional(_context);
            return imageFunctional.GetImageIdList(articleID);
        }

        // Добавление комментария
        [Authorize(Roles = "admin")]
        [Route("deleteImage")]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Image> DeleteImage([FromQuery] int imageID)
        {
            if (ModelState.IsValid)
            {
                string username = User.Identity.Name;
                //string username = "AntonSaliava";
                if (username != null)
                {
                    ImageFunctional imageFunctional = new ImageFunctional(_context);
                    imageFunctional.DeleteImage(imageID);
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
