using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class Subscription
    {
        [JsonProperty("SubscriptionID")]
        public int SubscriptionID { get; set; }

        [JsonProperty("UserID")]
        public int UserID { get; set; }

        [JsonProperty("TopicID")]
        public int TopicID { get; set; }
    }
}
