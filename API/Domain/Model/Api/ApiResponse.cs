using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Api
{
    public class ApiResponse<T>
    {
        public T? Data { get; set; }
        public string Message { get; set; }

        public ApiResponse(T? data, string message)
        {
            Data = data;
            Message = message;
        }

        public static ApiResponse<T> Success(T? data, string message = "Success")
        {
            return new ApiResponse<T>(data, message);
        }

        public static ApiResponse<T> Error(string message)
        {
            return new ApiResponse<T>(default, message);
        }

        public static ApiResponse<T> BadRequest(string message)
        {
            return new ApiResponse<T>(default, message);
        }
    }
}
