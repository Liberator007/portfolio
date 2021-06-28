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
    public class LoginRegistryFunctional
    {
        private NewsContext _context;

        public LoginRegistryFunctional(NewsContext context)
        {
            _context = context;
        }

        public string GetToken(User user)
        {
            var identity = GetIdentity(user);
            if (identity == null)
            {
                return null;
            }

            var now = DateTime.UtcNow;
            // создаем JWT-токен
            var jwt = new JwtSecurityToken(
                    issuer: AuthOptions.ISSUER,
                    audience: AuthOptions.AUDIENCE,
                    notBefore: now,
                    claims: identity.Claims,
                    expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }

        private ClaimsIdentity GetIdentity(User user)
        {
            if (user != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, user.Username),
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role)
                };
                ClaimsIdentity claimsIdentity =
                new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);
                return claimsIdentity;
            }

            // если пользователя не найдено
            return null;
        }

        public async Task RegistrationWithEmail(IUrlHelper url, string scheme, User user)
        {
            string token = GetToken(user);
            string action = "" ;
            string controller = "email-confirmed" ;

            var callbackUrl = url.Action(
                action,
                controller,
                new { username = user.Username, token = token },
                protocol: scheme);
            EmailService emailService = new EmailService();
            callbackUrl = callbackUrl.Replace("?", "/");
            await emailService.SendEmailAsync(user.Email, "Подтверждение регистрации", $"Подтвердите регистрацию, перейдя по ссылке: <a href='{callbackUrl}'>Подтверждение регистрации</a>");
        }

        public async Task<TokenObject> Authorization(User userData)
        {
            string token;
            User user = await _context.User.FirstOrDefaultAsync(user => (user.Username == userData.Username) && (user.Password == userData.Password) && (user.EmailConfirmed == true) && (user.Block == false));
            if (user == null)
            {
                return null;
            }
            token = GetToken(user);
            TokenObject tokenObject = new TokenObject();
            tokenObject.Username = user.Username;
            tokenObject.Role = user.Role;
            tokenObject.Token = token;

            return tokenObject;
        }

        public IEnumerable<UserAccess> GetUser()
        {
            List<User> listUser = _context.User.ToList();
            List<UserAccess> listUserAccess = new List<UserAccess>();
            foreach (User user in listUser)
            {
                UserAccess userAccess = new UserAccess();
                userAccess.UserID = user.UserID;
                userAccess.Username = user.Username;
                userAccess.Email = user.Email;
                userAccess.Role = user.Role;
                userAccess.EmailConfirmed = user.EmailConfirmed;
                userAccess.DateRegistration = user.DateRegistration;
                userAccess.Block = user.Block;
                listUserAccess.Add(userAccess);
            }
            return listUserAccess;
        }

        public void EditBanUser(int userID)
        {
            User user = _context.User.FirstOrDefault(user => user.UserID == userID);
            user.Block = !user.Block;
            _context.User.Update(user);
            _context.SaveChanges();
        }

        public void CreateUser(User user)
        {
            DateTime dateCreate = DateTime.Now;
            user.EmailConfirmed = true;
            user.DateCreate = dateCreate;
            user.DateRegistration = dateCreate;
            user.Block = false;

            _context.User.Add(user);
            _context.SaveChanges();
        }
    }
}
