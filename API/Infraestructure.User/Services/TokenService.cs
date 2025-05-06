using Infraestructure.General.SystemGeneral.Enums;
using Infraestructure.General.SystemGeneral.Model;
using Infraestructure.User.Model;
using Infraestructure.User.Services.Interface;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.User.Services
{
    public class TokenService(Configurations general) : ITokenService
    {
        private readonly Configurations _general = general;

        #region Private Methods

        private static DateTime DefineTimeExpire(int? time, TimeType? timeType)
        {
            DateTime expirationTime = DateTime.UtcNow;
            if (time != null && timeType != null)
            {
                switch (timeType)
                {
                    case TimeType.Milliseconds:
                        expirationTime = expirationTime.AddMilliseconds((int)time);
                        break;
                    case TimeType.Seconds:
                        expirationTime = expirationTime.AddSeconds((int)time);
                        break;
                    case TimeType.Minutes:
                        expirationTime = expirationTime.AddMinutes((int)time);
                        break;
                    case TimeType.Hours:
                        expirationTime = expirationTime.AddHours((int)time);
                        break;
                    case TimeType.Days:
                        expirationTime = expirationTime.AddDays((int)time);
                        break;
                }
            }
            return expirationTime;
        }

        #endregion

        #region Public Methods

        public string GenerateToken(Users user)
        {
            List<Claim> claims =
            [
                new(JwtRegisteredClaimNames.Sub, user.Name),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(ClaimTypes.Name, user.Name),
                new("level", user.Level.ToString())
            ];

            if (!string.IsNullOrEmpty(user.FirstName))
                claims.Add(new Claim("FirstName", user.FirstName));

            if (!string.IsNullOrEmpty(user.LastName))
                claims.Add(new Claim("LastName", user.LastName));

            foreach (var group in user.UserGroups)
                claims.Add(new Claim(ClaimTypes.Role, group));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_general.Jwt?.Key!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(
                issuer: _general.Jwt?.Issuer,
                audience: _general.Jwt?.Audience,
                claims: claims,
                expires: DefineTimeExpire(_general.Jwt?.ExpirationTime, _general.Jwt?.ExpirationTimeUnit),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        #endregion
    }
}
