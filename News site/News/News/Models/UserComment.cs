using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class UserComment
    {
        [JsonProperty("UserID")]
        public int UserID { get; set; }

        [JsonProperty("Username")]
        public string Username { get; set; }
    }
}
