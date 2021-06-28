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
    public class ArticleFunctional
    {
        private NewsContext _context;

        public ArticleFunctional(NewsContext context)
        {
            _context = context;
        }

        // Создание новости
        public int CreateArticle(int userID, int previewID)
        {
            int articleID;

            Article article = new Article();
            DateTime dateCreatArticle = DateTime.Now;

            article.Text = "";
            article.Name = "";
            article.Description = "";
            article.DateCreate = dateCreatArticle;
            article.Views = 0;
            article.UserID = userID;
            article.StatusRelease = false;
            article.Ban = false;
            article.PreviewID = previewID;

            _context.Article.Add(article);
            _context.SaveChanges();

            articleID = article.ArticleID;

            return articleID;
        }

        // Редактирование новости
        public int UpdateArticle(Article articleUpdate)
        {
            Article article = _context.Article.FirstOrDefault(article => article.ArticleID == articleUpdate.ArticleID);

            article.Text = articleUpdate.Text;
            article.Name = articleUpdate.Name;
            article.Description = articleUpdate.Description;
            article.TopicID = articleUpdate.TopicID;

            _context.Article.Update(article);
            _context.SaveChanges();

            return articleUpdate.ArticleID;
        }

        // Удаление новости
        public void DeleteArticle(int articleID)
        {
            Article article = _context.Article.FirstOrDefault(article => article.ArticleID == articleID);
            List<RateArticle> listRateArticle = _context.RateArticle.Where(rateArticle => rateArticle.ArticleID == articleID).ToList();
            foreach (RateArticle rateArticle in listRateArticle)
            {
                _context.RateArticle.Remove(rateArticle);
            }
            _context.SaveChanges();

            List<RateComment> listRateComment = _context.RateComment.Where(rateComment => rateComment.ArticleID == articleID).ToList();
            foreach (RateComment rateComment in listRateComment)
            {
                _context.RateComment.Remove(rateComment);
            }
            _context.SaveChanges();

            List<Comment> listComment = _context.Comment.Where(comment => comment.ArticleID == articleID).ToList();
            foreach (Comment comment in listComment)
            {
                _context.Comment.Remove(comment);
            }
            _context.SaveChanges();

            Preview preview = _context.Preview.FirstOrDefault(preview => preview.PreviewID == article.PreviewID);
            article.PreviewID = null;
            _context.Article.Update(article);
            _context.Preview.Remove(preview);
            _context.SaveChanges();

            List<Image> listImage = _context.Image.Where(image => image.ArticleID == articleID).ToList();
            foreach (Image image in listImage)
            {
                _context.Image.Remove(image);
            }
            _context.SaveChanges();

            _context.Article.Remove(article);
            _context.SaveChanges();
        }

        // Редактирование блокировки новости
        public void EditBanArticle(int articleID)
        {
            Article article = _context.Article.FirstOrDefault(article => article.ArticleID == articleID);
            article.Ban = !article.Ban;
            _context.Article.Update(article);
            _context.SaveChanges();
        }

        // Получение новости по идентификатору
        public Article GetArticleByID(int articleID)
        {
            Article article = _context.Article.FirstOrDefault(article => article.ArticleID == articleID);
            return article;
        }

        // Получение всех новостей опубликованных определенным пользователем
        public IEnumerable<Article> GetArticleUserList(string username)
        {
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            List<Article> listArticle = _context.Article.Where(article => article.UserID == user.UserID).OrderBy(article => article.ArticleID).ToList();
            return listArticle;
        }

        // Получение всех новостей
        public IEnumerable<Article> GetArticleList()
        {
            List<Article> listArticle = _context.Article.OrderBy(article => article.ArticleID).ToList();
            return listArticle;
        }

        // Для вывода пользователя
        // Получение всех опубликованных новостей 
        public IEnumerable<Article> GetArticleListAllStatusReleaseTrue()
        {
            List<Article> listArticle = _context.Article.Where(article => (article.StatusRelease == true) && (article.Ban == false)).OrderByDescending(article => article.DateRelease).ToList();
            return listArticle;
        }

        // Для вывода пользователя
        // Получение всех найденных новостей по совпадению определенноого слова в названии новости
        public IEnumerable<Article> GetArticleListSearchName(string search)
        {
            List<Article> listArticle = _context.Article.Where(article => (article.StatusRelease == true) && (article.Name.Contains(search) == true) && (article.Ban == false)).OrderByDescending(article => article.DateRelease).ToList();
            return listArticle;
        }

        // Получение всех новостей на определенную тему
        public IEnumerable<Article> GetArticleListByTopicID(int topicID)
        {
            List<Article> listArticle = _context.Article.Where(article => (article.StatusRelease == true) && (article.TopicID == topicID)).OrderByDescending(article => article.DateRelease).ToList();
            return listArticle;
        }

        // Публикация новости и рассылка новостей
        public async Task<bool> ReleaseArticle(IUrlHelper url, string scheme, int articleID)
        {
            Article article = _context.Article.FirstOrDefault(article => article.ArticleID == articleID);
            if (article.StatusRelease)
            {
                return false;
            }
            DateTime dateReleaseArticle = DateTime.Now;
            article.DateRelease = dateReleaseArticle;
            article.StatusRelease = true;
            _context.Article.Update(article);
            _context.SaveChanges();

            int topicID = (int)article.TopicID;
            Topic topic = GetTopic(topicID);
            List<int> listUserID = _context.Subscription.Where(subscription => subscription.TopicID == topicID).Select(subscription => subscription.UserID).ToList();
            List<string> listUserEmail = _context.User.Where(user => listUserID.Contains(user.UserID)).Select(user => user.Email).ToList();

            string action = "";
            string controller = "article";
            var callbackUrl = url.Action(
                action,
                controller,
                new { articleID = articleID },
                protocol: scheme);
            EmailService emailService = new EmailService();
            callbackUrl = callbackUrl.Replace("?", "/");
            foreach (string userEmail in listUserEmail)
            {
                await emailService.SendEmailAsync(userEmail, $"Подписка на NEWS.BY", $"Опубликована новостная статья на тему '{topic.Name}': <a href='{callbackUrl}'>{article.Name}</a>");
            }
            return true;
        }

        // Получение списка тем новостей
        public IEnumerable<Topic> GetTopicList()
        {
            List<Topic> listTopic = _context.Topic.ToList();
            return listTopic;
        }

        // Получение темы новости по его идентификатору
        public Topic GetTopic(int topicID)
        {
            Topic topic = _context.Topic.FirstOrDefault(topic => topic.TopicID == topicID);
            return topic;
        }

        // Добавление новой темы новости
        public void CreateTopic(Topic topic)
        {
            _context.Topic.Add(topic);
            _context.SaveChanges();
        }

        // Удаление темы
        public void DeleteTopic(int topicID)
        {
            List<Article> listArticle = _context.Article.Where(article => article.TopicID == topicID).ToList();
            foreach (Article article in listArticle)
            {
                DeleteArticle(article.ArticleID);
            }
            _context.SaveChanges();

            List<Subscription> listSubscription = _context.Subscription.Where(subscription => subscription.TopicID == topicID).ToList();
            SubscriptionFunctional subscriptionFunctional = new SubscriptionFunctional(_context);
            foreach (Subscription subscription in listSubscription)
            {
                subscriptionFunctional.DeleteSubscription(subscription.SubscriptionID);
            }
            _context.SaveChanges();

            Topic topic = _context.Topic.FirstOrDefault(topic => topic.TopicID == topicID);
            _context.Topic.Remove(topic);
            _context.SaveChanges();
        }

        //------Сортировка новостей----------------------------------------------------------------------------------------------------------------------------------------------------------

        // Получение отсортированных всех опубликованных новостей по ID
        public IEnumerable<Article> GetArticleSortID(bool sort)
        {
            List<Article> listArticle = null;
            if (sort)
            {
                listArticle = _context.Article.OrderBy(article => article.ArticleID).ToList();
            }
            else
            {
                listArticle = _context.Article.OrderByDescending(article => article.ArticleID).ToList();
            }
            return listArticle;
        }

        // Получение отсортированных всех опубликованных новостей по DateRelease
        public IEnumerable<Article> GetArticleSortDateRelease(bool sort)
        {
            List<Article> listArticle = null;
            if (sort)
            {
                listArticle = _context.Article.OrderBy(article => article.DateRelease).ToList();
            }
            else
            {
                listArticle = _context.Article.OrderByDescending(article => article.DateRelease).ToList();
            }
            return listArticle;
        }

        //------Сортировка новостей определенного пользователя-----------------------------------------------------------------------------------------------------------------------------------

        // Получение отсортированных всех опубликованных новостей по ID
        public IEnumerable<Article> GetArticleUserSortID(string username, bool sort)
        {
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            List<Article> listArticle = null;
            if (sort)
            {
                listArticle = _context.Article.Where(article => article.UserID == user.UserID).OrderBy(article => article.ArticleID).ToList();
            }
            else
            {
                listArticle = _context.Article.Where(article => article.UserID == user.UserID).OrderByDescending(article => article.ArticleID).ToList();
            }
            return listArticle;
        }

        // Получение отсортированных всех опубликованных новостей по DateRelease
        public IEnumerable<Article> GetArticleUserSortDateRelease(string username, bool sort)
        {
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            List<Article> listArticle = null;
            if (sort)
            {
                listArticle = _context.Article.Where(article => article.UserID == user.UserID).OrderBy(article => article.DateRelease).ToList();
            }
            else
            {
                listArticle = _context.Article.Where(article => article.UserID == user.UserID).OrderByDescending(article => article.DateRelease).ToList();
            }
            return listArticle;
        }

        //------Получение опубликованных/неопубликованных новостей-----------------------------------------------------------------------------------------------------------------------------------
        public IEnumerable<Article> GetArticleUserSortStatusRelease(string username, bool release)
        {
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            List<Article> listArticle = listArticle = _context.Article.Where(article => (article.StatusRelease == release) && (article.UserID == user.UserID)).OrderBy(article => article.ArticleID).ToList();
            return listArticle;
        }

        // Получение опубликованных/неопубликованных новостей
        public IEnumerable<Article> GetArticleSortStatusRelease(bool release)
        {
            List<Article> listArticle = listArticle = _context.Article.Where(article => article.StatusRelease == release).OrderBy(article => article.ArticleID).ToList();
            return listArticle;
        }

        //------Сортировка тем и пользователей по ID--------------------------------------------------------------------------------------------------------------------------------------------
        // Получение отсортированных пользователей по ID
        public IEnumerable<User> GetUserSortID(bool sort)
        {
            List<User> listUser = null;
            if (sort)
            {
                listUser = _context.User.OrderBy(user => user.UserID).ToList();
            }
            else
            {
                listUser = _context.User.OrderByDescending(user => user.UserID).ToList();
            }
            return listUser;
        }

        // Получение отсортированных тем по ID
        public IEnumerable<Topic> GetTopicSortID(bool sort)
        {
            List<Topic> listTopic = null;
            if (sort)
            {
                listTopic = _context.Topic.OrderBy(topic => topic.TopicID).ToList();
            }
            else
            {
                listTopic = _context.Topic.OrderByDescending(topic => topic.TopicID).ToList();
            }
            return listTopic;
        }

        //------Фильтры поиска сопадений в полю Name ----------------------------------------------------------------------------------------------------------------------------------------------
        // Получение всех найденных новостей по совпадению определенноого слова в названии
        public IEnumerable<Article> GetArticleSearch(string search)
        {
            List<Article> listArticle = _context.Article.Where(article => article.Name.Contains(search) == true).OrderBy(article => article.ArticleID).ToList();
            return listArticle;
        }

        // Получение всех найденных новостей поределенного пользователя по совпадению определенноого слова в названии
        public IEnumerable<Article> GetArticleUserSearch(string username, string search)
        {
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            List<Article> listArticle = _context.Article.Where(article => (article.UserID == user.UserID) && (article.Name.Contains(search) == true)).OrderBy(article => article.ArticleID).ToList();
            return listArticle;
        }

        // Получение всех найденных пользвоателей по совпадению определенноого слова в имени пользователя
        public IEnumerable<User> GetUserSearch(string search)
        {
            List<User> listUser = _context.User.Where(user => user.Username.Contains(search) == true).OrderBy(user => user.UserID).ToList();
            return listUser;
        }

        // Получение всех найденных тем по совпадению определенноого слова в названии
        public IEnumerable<Topic> GetTopicSearch(string search)
        {
            List<Topic> listTopic = _context.Topic.Where(topic => topic.Name.Contains(search) == true).OrderBy(topic => topic.TopicID).ToList();
            return listTopic;
        }
    }
}
