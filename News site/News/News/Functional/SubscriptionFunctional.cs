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
    public class SubscriptionFunctional
    {
        private NewsContext _context;

        public SubscriptionFunctional(NewsContext context)
        {
            _context = context;
        }

        // Добавление подписки
        public bool CreateSubscription(int topicID, string username)
        {
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            Subscription subscription;
            subscription = _context.Subscription.FirstOrDefault(subscription => (subscription.TopicID == topicID) && (subscription.UserID == user.UserID));
            if (subscription != null)
            {
                return false;
            }
            subscription = new Subscription();
            subscription.UserID = user.UserID;
            subscription.TopicID = topicID;
            _context.Subscription.Add(subscription);
            _context.SaveChanges();
            return true;
        }

        // Удаление комментария
        public void DeleteSubscription(int subscriptionID)
        {
            Subscription subscription = _context.Subscription.FirstOrDefault(subscription => subscription.SubscriptionID == subscriptionID);
            _context.Subscription.Remove(subscription);
            _context.SaveChanges();
        }

        // Получение всех подписок пользователя
        public IEnumerable<Subscription> GetSubscriptionList(string username)
        {
            User user = _context.User.FirstOrDefault(user => user.Username == username);
            List<Subscription> listSubscription = _context.Subscription.Where(subscription => subscription.UserID == user.UserID).ToList();
            return listSubscription;
        }
    }
}
