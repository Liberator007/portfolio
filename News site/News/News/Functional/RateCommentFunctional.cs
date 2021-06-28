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
    public class RateCommentFunctional
    {
        private NewsContext _context;

        public RateCommentFunctional(NewsContext context)
        {
            _context = context;
        }

        // Изменение лайка комментария
        public void ChangeLike(int commentID, string username)
        {
            int userID = _context.User.FirstOrDefault(user => user.Username == username).UserID;
            int articleID = _context.Comment.FirstOrDefault(comment => comment.CommentID == commentID).ArticleID;
            RateComment rateComment = _context.RateComment.FirstOrDefault(rateComment => (rateComment.CommentID == commentID) && (rateComment.UserID == userID));
            if (rateComment == null)
            {
                rateComment = new RateComment();
                rateComment.UserID = userID;
                rateComment.ArticleID = articleID;
                rateComment.CommentID = commentID;
                rateComment.Like = false;
                rateComment.Dislike = false;
                _context.RateComment.Add(rateComment);
                _context.SaveChanges();
            }
            if (rateComment.Dislike == true)
            {
                rateComment.Dislike = false;
            }
            rateComment.Like = !rateComment.Like;
            _context.RateComment.Update(rateComment);
            _context.SaveChanges();
        }

        // Изменение дизлайка комментария
        public void ChangeDislike(int commentID, string username)
        {
            int userID = _context.User.FirstOrDefault(user => user.Username == username).UserID;
            int articleID = _context.Comment.FirstOrDefault(comment => comment.CommentID == commentID).ArticleID;
            RateComment rateComment = _context.RateComment.FirstOrDefault(rateComment => (rateComment.CommentID == commentID) && (rateComment.UserID == userID));
            if (rateComment == null)
            {
                rateComment = new RateComment();
                rateComment.UserID = userID;
                rateComment.ArticleID = articleID;
                rateComment.CommentID = commentID;
                rateComment.Like = false;
                rateComment.Dislike = false;
                _context.RateComment.Add(rateComment);
                _context.SaveChanges();
            }
            if (rateComment.Like == true)
            {
                rateComment.Like = false;
            }
            rateComment.Dislike = !rateComment.Dislike;
            _context.RateComment.Update(rateComment);
            _context.SaveChanges();
        }

        // Получение оценок комментариев определенного пользователя к определенной новости
        public IEnumerable<RateComment> GetListRateCommentUser(int articleID, string username)
        {
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            List<RateComment> listRateCommentUser = _context.RateComment.Where(rateComment => (rateComment.ArticleID == articleID) && (rateComment.UserID == user.UserID)).ToList();
            return listRateCommentUser;
        }

        // Получение оценок всех комментариев
        public IEnumerable<RateSumCommet> GetRateCommentList(int articleID)
        {
            List<int> listCommentID = _context.Comment.Where(comment => comment.ArticleID == articleID).Select(comment => comment.CommentID).ToList();
            List<RateSumCommet> listRateSumCommet = new List<RateSumCommet>();
            foreach (int commentID in listCommentID)
            {
                RateSumCommet rateSum = new RateSumCommet();
                rateSum.CommentID = commentID;
                List<RateComment> listRateComment = _context.RateComment.Where(rateComment => rateComment.CommentID == commentID).ToList();
                foreach (RateComment rateComment in listRateComment)
                {
                    if (rateComment.Like)
                    {
                        rateSum.Like++;
                    }
                    if (rateComment.Dislike)
                    {
                        rateSum.Dislike++;
                    }
                }
                listRateSumCommet.Add(rateSum);
            }
            return listRateSumCommet;
        }
    }
}
