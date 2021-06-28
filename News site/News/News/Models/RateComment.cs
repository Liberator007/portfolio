using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class RateComment
    {
        [JsonProperty("RateCommentID")]
        public int RateCommentID { get; set; }

        [JsonProperty("Like")]
        public bool Like { get; set; }
		
		[JsonProperty("Dislike")]
        public bool Dislike { get; set; }

        [JsonProperty("CommentID")]
        public int CommentID { get; set; }

        [JsonProperty("UserID")]
        public int UserID { get; set; }

        [JsonProperty("ArticleID")]
        public int ArticleID { get; set; }
    }
}
