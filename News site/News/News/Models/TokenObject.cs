using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class TokenObject
    {
        [JsonProperty("Username")]
        public string Username { get; set; }

        [JsonProperty("Role")]
        public string Role { get; set; }

        [JsonProperty("Token")]
        public string Token { get; set; }
    }
}
