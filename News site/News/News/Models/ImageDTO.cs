using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    public partial class ImageDTO
    {
        public IFormFile FormFile { get; set; }

        public int ArticleID { get; set; }
    }
}
