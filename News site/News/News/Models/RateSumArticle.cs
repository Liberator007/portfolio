using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class RateSumArticle
    {
        [JsonProperty("ArticleID")]
        public int ArticleID { get; set; }

        [JsonProperty("Like")]
        public int Like { get; set; }
		
		[JsonProperty("Dislike")]
        public int Dislike { get; set; }
    }
}
