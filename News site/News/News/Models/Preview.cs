using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class Preview
    {
        [JsonProperty("PreviewID")]
        public int PreviewID { get; set; }

        [JsonProperty("ImageID")]
        public int? ImageID { get; set; }
    }
}
