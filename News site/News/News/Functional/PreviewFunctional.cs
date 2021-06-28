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

namespace News
{
    public class PreviewFunctional
    {
        private NewsContext _context;

        public PreviewFunctional(NewsContext context)
        {
            _context = context;
        }

        public int CreatePreview()
        {
            int previewID;
            Preview preview = new Preview();
            preview.ImageID = null;
            _context.Preview.Add(preview);
            _context.SaveChanges();
            previewID = preview.PreviewID;
            return previewID;
        }
      
        public Preview GetPreview(int previewID)
        {
            Preview preview = _context.Preview.FirstOrDefault(preview => preview.PreviewID == previewID);
            return preview;
        }

        public Preview GetPreviewByID(int articleID)
        {
            Article article = _context.Article.FirstOrDefault(article => article.ArticleID == articleID);
            Preview preview = _context.Preview.FirstOrDefault(preview => preview.PreviewID == article.PreviewID);
            return preview;
        }

        public bool UpdatePreview(ImageDTO imageDTO)
        {
            try
            {
                int? previewID;
                int? imageID;
                int articleID = imageDTO.ArticleID;

                ArticleFunctional articleFunctional = new ArticleFunctional(_context);
                Article article = articleFunctional.GetArticleByID(articleID);
                previewID = article.PreviewID;
                ImageFunctional imageFunctional = new ImageFunctional(_context);
                imageID = imageFunctional.AddImage(imageDTO);
                Preview preview = _context.Preview.FirstOrDefault(preview => preview.PreviewID == previewID);
                preview.ImageID = imageID;

                _context.Preview.Update(preview);
                _context.SaveChanges();

                return true;
            }
            catch(Exception ex)
            {
                return false;
            }
        }

        public IEnumerable<Preview> GetPreviewList()
        {
            List<Preview> listPreview = _context.Preview.ToList();
            return listPreview;
        }
    }
}
