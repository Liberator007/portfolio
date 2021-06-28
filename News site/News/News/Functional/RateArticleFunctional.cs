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
    public class RateArticleFunctional
    {
        private NewsContext _context;

        public RateArticleFunctional(NewsContext context)
        {
            _context = context;
        }

        // Изменение лайка
        public void ChangeLike(int articleID, string username)
        {
            int userID = _context.User.FirstOrDefault(user => user.Username == username).UserID;
            RateArticle rateArticle = _context.RateArticle.FirstOrDefault(rateArticle => (rateArticle.ArticleID == articleID) && (rateArticle.UserID == userID));
            if (rateArticle == null)
            {
                rateArticle = new RateArticle();
                rateArticle.UserID = userID;
                rateArticle.ArticleID = articleID;
                rateArticle.Like = false;
                rateArticle.Dislike = false;
                _context.RateArticle.Add(rateArticle);
                _context.SaveChanges();
            }
            if (rateArticle.Dislike == true)
            {
                rateArticle.Dislike = false;
            }
            rateArticle.Like = !rateArticle.Like;
            _context.RateArticle.Update(rateArticle);
            _context.SaveChanges();
        }

        // Изменение дизлайка
        public void ChangeDislike(int articleID, string username)
        {
            int userID = _context.User.FirstOrDefault(user => user.Username == username).UserID;
            RateArticle rateArticle = _context.RateArticle.FirstOrDefault(rateArticle => (rateArticle.ArticleID == articleID) && (rateArticle.UserID == userID));
            if (rateArticle == null)
            {
                rateArticle = new RateArticle();
                rateArticle.UserID = userID;
                rateArticle.ArticleID = articleID;
                rateArticle.Like = false;
                rateArticle.Dislike = false;
                _context.RateArticle.Add(rateArticle);
                _context.SaveChanges();
            }
            if (rateArticle.Like == true)
            {
                rateArticle.Like = false;
            }
            rateArticle.Dislike = !rateArticle.Dislike;
            _context.RateArticle.Update(rateArticle);
            _context.SaveChanges();
        }

        // Получение оценки новости определенного пользователя
        public RateArticle GetRateArticleUser(int articleID, string username)
        {
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            RateArticle rateArticle = _context.RateArticle.FirstOrDefault(rateArticle => (rateArticle.ArticleID == articleID) && (rateArticle.UserID == user.UserID));
            return rateArticle;
        }

        // Получение оценок всех новостей
        public IEnumerable<RateSumArticle> GetRateArticleList()
        {
            List<int> listArticleID = _context.Article.Select(article => article.ArticleID).ToList();
            List<RateSumArticle> listRateSum = new List<RateSumArticle>();
            foreach (int articleID in listArticleID)
            {
                RateSumArticle rateSum = new RateSumArticle();
                rateSum.ArticleID = articleID;
                List<RateArticle> listRateArticle = _context.RateArticle.Where(rateArticle => rateArticle.ArticleID == articleID).ToList();
                foreach (RateArticle rateArticle in listRateArticle)
                {
                    if (rateArticle.Like)
                    {
                        rateSum.Like++; 
                    }
                    if (rateArticle.Dislike)
                    {
                        rateSum.Dislike++;
                    }
                }
                listRateSum.Add(rateSum);
            }
            return listRateSum;
        }

        // Получение оценок одной новости
        public RateSumArticle GetRateArticle(int articleID)
        {
            RateSumArticle rateSum = new RateSumArticle();
            rateSum.ArticleID = articleID;
            List<RateArticle> listRateArticle = _context.RateArticle.Where(rateArticle => rateArticle.ArticleID == articleID).ToList();
            foreach (RateArticle rateArticle in listRateArticle)
            {
                if (rateArticle.Like)
                {
                    rateSum.Like++;
                }
                if (rateArticle.Dislike)
                {
                    rateSum.Dislike++;
                }
            }
            return rateSum;
        }
    }
}
