using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Domain.Model.Api;

namespace API.ApiActionResult
{
    public class ApiResponseFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        { }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Result is ObjectResult objectResult)
            {
                object? result = objectResult.Value;

                if (result is ApiResponse<object>)
                {
                    return;
                }

                objectResult.Value = objectResult.StatusCode switch
                {
                    // OK
                    200 => ApiResponse<object>.Success(result),
                    // Bad Request
                    400 => ApiResponse<object>.Error(result?.ToString() ?? "Erro de requisição inválida"),
                    // Unauthorized
                    401 => ApiResponse<object>.Error("Não autorizado"),
                    // Not Found
                    404 => ApiResponse<object>.Error("Recurso não encontrado"),
                    // Internal Server Error
                    500 => ApiResponse<object>.Error("Erro interno do servidor"),
                    _ => ApiResponse<object>.Error("Erro desconhecido"),
                };
            }
        }
    }
}
