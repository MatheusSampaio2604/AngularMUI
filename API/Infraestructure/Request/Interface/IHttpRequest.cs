namespace Infraestructure.Request.Interface
{
    public interface IHttpRequest
    {
        Task<TResponse?> GetAsync<TResponse>(string url);
        Task<TResponse?> PostAsync<TRequest, TResponse>(string url, TRequest data);
        Task<TResponse?> PutAsync<TRequest, TResponse>(string url, TRequest data);
        Task<TResponse?> DeleteAsync<TRequest, TResponse>(string url);
    }
}
