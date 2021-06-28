using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace News
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreviewController : ControllerBase
    {
        private readonly ILogger<PreviewController> _logger;
        private NewsContext _context;
        public PreviewController(ILogger<PreviewController> logger, NewsContext context)
        {
            _logger = logger;
            _context = context;
        }

        // Обновление превью новости
        //[Authorize(Roles = "admin")]
        [Route("updataPreview")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Preview> UpdataPreview([FromForm] ImageDTO imageDTO)
        {  
            if (ModelState.IsValid)
            {
                if (imageDTO != null)
                {
                    PreviewFunctional previewFunctional = new PreviewFunctional(_context);
                    if (previewFunctional.UpdatePreview(imageDTO))
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

        [Route("getPreview")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<Preview> GetPreview([FromQuery] int previewID)
        {
            PreviewFunctional previewFunctional = new PreviewFunctional(_context);
            Preview preview = previewFunctional.GetPreview(previewID);
            return preview;
        }

        [Route("getPreviewByID")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<Preview> GetPreviewByID([FromQuery] int articleID)
        {
            PreviewFunctional previewFunctional = new PreviewFunctional(_context);
            Preview preview = previewFunctional.GetPreviewByID(articleID);
            return preview;
        }

        [Route("getPreviewList")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IEnumerable<Preview>> GetPreviewList()
        {
            PreviewFunctional previewFunctional = new PreviewFunctional(_context);
            List<Preview> listPreview = previewFunctional.GetPreviewList().ToList();
            return listPreview;
        }

    }
}
