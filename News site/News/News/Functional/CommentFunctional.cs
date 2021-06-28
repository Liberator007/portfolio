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
    public class CommentFunctional
    {
        private NewsContext _context;

        public CommentFunctional(NewsContext context)
        {
            _context = context;
        }

        // Создание комментария
        public void CreateComment(Comment commentNew, string username)
        {
            Comment comment = new Comment();
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            DateTime dateCreatComment = DateTime.Now;
            comment.Text = commentNew.Text;
            comment.ArticleID = commentNew.ArticleID;
            comment.DateAdded = dateCreatComment;
            comment.UserID = user.UserID;
            _context.Comment.Add(comment);
            _context.SaveChanges();
        }

        // Получение всех комментариев к статье
        public IEnumerable<Comment> GetCommentList(int articleID)
        {
            List<Comment> listComment = _context.Comment.Where(comment => comment.ArticleID == articleID).ToList();
            return listComment;
        }

        // Получение самого популярного комментария
        public Comment GetCommentTop(int articleID)
        {
            List<Comment> listComment = _context.Comment.Where(comment => comment.ArticleID == articleID).ToList();
            int maxLike = 0;
            Comment commentMaxLike = _context.Comment.Where(comment => comment.ArticleID == articleID).FirstOrDefault();
            foreach (Comment comment in listComment)
            {
                int like = 0;
                List<RateComment> listRateComment = _context.RateComment.Where(rateComment => rateComment.CommentID == comment.CommentID).ToList();
                foreach (RateComment rateComment in listRateComment)
                {
                    if (rateComment.Like)
                    {
                        like++;
                    }
                }
                if (maxLike < like)
                {
                    commentMaxLike = comment;
                }
            }
            return commentMaxLike;
        }

        // Получение комментария
        public Comment GetComment(int commentID)
        {
            Comment comment = _context.Comment.FirstOrDefault(comment => comment.CommentID == commentID);
            return comment;
        }

        // Редактирование комментария
        public void UpdateComment(Comment commentNew)
        {
            Comment comment = _context.Comment.FirstOrDefault(comment => comment.CommentID == commentNew.CommentID);
            comment.Text = commentNew.Text;
            _context.Comment.Update(comment);
            _context.SaveChanges();
        }

        // Удаление комментария
        public void DeleteComment(int commentID)
        {
            List<RateComment> listRateComment = _context.RateComment.Where(rateComment => rateComment.CommentID == commentID).ToList();
            foreach (RateComment rateComment in listRateComment)
            {
                _context.RateComment.Remove(rateComment);
            }
            _context.SaveChanges();
            Comment comment = _context.Comment.FirstOrDefault(comment => comment.CommentID == commentID);
            _context.Comment.Remove(comment);
            _context.SaveChanges();
        }
    }
}
