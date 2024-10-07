using System;
using System.Security.Cryptography;
using System.Text;

namespace eventbuddy_api
{
    public class Hash
    {
        public static string BuildSHA256(string password)
        {
            using SHA256 sha256 = SHA256.Create();
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

            byte[] hashBytes = sha256.ComputeHash(passwordBytes);
            StringBuilder hashStringBuilder = new StringBuilder();
            foreach (byte b in hashBytes)
            {
                hashStringBuilder.Append(b.ToString("x2"));
            }
            return hashStringBuilder.ToString();
        }
        public static bool Verify(string password, string hash) => BuildSHA256(password) == hash;
    }
}