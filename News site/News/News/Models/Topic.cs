using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class Topic
    {
        [JsonProperty("TopicID")]
        public int TopicID { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }
    }
}
