using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class Article
    {
        [JsonProperty("ArticleID")]
        public int ArticleID { get; set; }

        [JsonProperty("Text")]
        public string Text { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        [JsonProperty("DateCreate")]
        public DateTime? DateCreate { get; set; }

        [JsonProperty("DateRelease")]
        public DateTime? DateRelease { get; set; }

        [JsonProperty("Views")]
        public int Views { get; set; }

        [JsonProperty("TopicID")]
        public int? TopicID { get; set; }

        [JsonProperty("UserID")]
        public int UserID { get; set; }

        [JsonProperty("StatusRelease")]
        public bool StatusRelease { get; set; }

        [JsonProperty("Ban")]
        public bool Ban { get; set; }

        [JsonProperty("PreviewID")]
        public int? PreviewID { get; set; }
    }
}
