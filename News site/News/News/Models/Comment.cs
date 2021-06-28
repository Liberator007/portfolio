using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class Comment
    {
        [JsonProperty("CommentID")]
        public int CommentID { get; set; }

        [JsonProperty("Text")]
        public string Text { get; set; }
		
		[JsonProperty("DateAdded")]
        public DateTime DateAdded { get; set; }

        [JsonProperty("ArticleID")]
        public int ArticleID { get; set; }

        [JsonProperty("UserID")]
        public int UserID { get; set; }
    }
}
