using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class RateSumCommet
    {
        [JsonProperty("CommentID")]
        public int CommentID { get; set; }

        [JsonProperty("Like")]
        public int Like { get; set; }
		
		[JsonProperty("Dislike")]
        public int Dislike { get; set; }
    }
}
