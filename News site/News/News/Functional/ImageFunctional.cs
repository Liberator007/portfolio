using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Mime;

namespace News
{
    public class ImageFunctional
    {
        private NewsContext _context;

        public ImageFunctional(NewsContext context)
        {
            _context = context;
        }

        // Получение списка Id изображений привязанных к определенной статье
        public IEnumerable<int> GetImageIdList(int articleID)
        {
            List<int> listImageID = _context.Image.Where(i => i.ArticleID == articleID).Select(i => i.ImageID).ToList();
            return listImageID;
        }

        // Добавление изображения
        public int? AddImage(ImageDTO imageDTO)
        {
            try
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
                image.ArticleID = imageDTO.ArticleID;

                _context.Image.Add(image);
                _context.SaveChanges();

                return image.ImageID;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        // Получение изображения
        public async Task<MemoryStream> GetImage(string path)
        {
            MemoryStream memoryStream = new MemoryStream();
            using (Stream stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memoryStream);
            }
            memoryStream.Position = 0;
            return memoryStream;
        }

        // Получение пути изображения
        public async Task<string> PathImage(int imageID)
        {
            Image image = await _context.Image.FindAsync(imageID); // Find может не работать
            if (image != null)
            {
                string folder = "Images";
                string fileName = image.Path;
                string path = Path.Combine(Directory.GetCurrentDirectory(), folder, fileName);
                return path;
            } 
            else
            {
                return null;
            }
        }

        // Удаление изображения
        public void DeleteImage(int imageID)
        {
            Image image = _context.Image.FirstOrDefault(image => image.ImageID == imageID);
            _context.Image.Remove(image);
            _context.SaveChanges();
        }
    }
}
