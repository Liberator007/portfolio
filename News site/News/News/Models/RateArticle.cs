using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class RateArticle
    {
        [JsonProperty("RateArticleID")]
        public int RateArticleID { get; set; }

        [JsonProperty("Like")]
        public bool Like { get; set; }
		
		[JsonProperty("Dislike")]
        public bool Dislike { get; set; }

        [JsonProperty("ArticleID")]
        public int ArticleID { get; set; }

        [JsonProperty("UserID")]
        public int UserID { get; set; }
    }
}
