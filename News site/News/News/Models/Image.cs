using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class Image
    {
        [JsonProperty("ImageID")]
        public int ImageID { get; set; }

        [JsonProperty("Path")]
        public string Path { get; set; }

        [JsonProperty("ArticleID")]
        public int ArticleID { get; set; }
		
        [JsonProperty("DateAdded")]
        public DateTime DateAdded { get; set; }
    }
}
