using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace News
{
    public class AuthOptions
    {
        public const string ISSUER = "News"; // издатель токена
        public const string AUDIENCE = "AuthClient"; // потребитель токена
        const string KEY = "supersecretkey_seliavy2709199";   // ключ для шифрации
        public const int LIFETIME = 1 * 60 * 24 * 7; // время жизни токена - 1 неделя
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
