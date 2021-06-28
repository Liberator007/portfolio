using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace News
{
    public class NewsContext: DbContext
    {
        public DbSet<User> User { get; set; }

        public DbSet<Article> Article { get; set; }

        public DbSet<Image> Image { get; set; }

        public DbSet<Topic> Topic { get; set; }
		
        public DbSet<Subscription> Subscription { get; set; }
		
        public DbSet<Comment> Comment { get; set; }
		
        public DbSet<RateComment> RateComment { get; set; }
		
        public DbSet<RateArticle> RateArticle { get; set; }

        public DbSet<Preview> Preview { get; set; }

        public NewsContext(DbContextOptions<NewsContext> options): base(options)
        {
            Database.EnsureCreated();   // создаем базу данных при первом обращении
        }
    }
}
