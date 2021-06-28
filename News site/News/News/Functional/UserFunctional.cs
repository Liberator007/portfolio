using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;

namespace News
{
    public class UserFunctional
    {
        private NewsContext _context;

        public UserFunctional(NewsContext context)
        {
            _context = context;
        }

        // Вывод всех пользователей которые оставили комментарии
        public IEnumerable<UserComment> GetUserComment(int articleID)
        {
            List<Comment> listComment = _context.Comment.Where(comment => comment.ArticleID == articleID).ToList();
            List<UserComment> listUserComment = new List<UserComment>();
            foreach (Comment comment in listComment)
            {
                User user = _context.User.FirstOrDefault(user => user.UserID == comment.UserID);
                UserComment userComment = new UserComment();
                userComment.UserID = user.UserID;
                userComment.Username = user.Username;
                listUserComment.Add(userComment);
            }
            return listUserComment;
        }

        // Вывод ID пользователя
        public int? GetUserID(string username)
        {
            int? userID = _context.User.FirstOrDefault(user => user.Username == username).UserID;
            return userID;
        }
    }
}
