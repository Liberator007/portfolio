using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace News
{
    [Serializable]
    public partial class UserAccess
    {
        [JsonProperty("UserID")]
        public int UserID { get; set; }

        [JsonProperty("Username")]
        public string Username { get; set; }

        [JsonProperty("Email")]
        public string Email { get; set; }

        [JsonProperty("Role")]
        public string Role { get; set; }

        [JsonProperty("EmailConfirmed")]
        public bool EmailConfirmed { get; set; }

        [JsonProperty("DateRegistration")]
        public DateTime? DateRegistration { get; set; }

        [JsonProperty("Block")]
        public bool Block { get; set; }
    }
}
