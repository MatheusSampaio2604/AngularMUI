using Infraestructure.Request.Interface;
using Newtonsoft.Json;
using System;
using System.Text;

namespace Infraestructure.Request
{
    public class HttpRequest : IHttpRequest
    {
        private readonly HttpClient _httpClient;

        public HttpRequest(HttpClient httpClient)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _httpClient.Timeout = TimeSpan.FromMilliseconds(16000);
        }

        public TResponse? ConvertResponse<TResponse>(string responseData)
        {
            return Type.GetTypeCode(typeof(TResponse)) switch
            {
                TypeCode.String => (TResponse)(object)responseData,
                TypeCode.Boolean => (TResponse)(object)Convert.ToBoolean(responseData),
                _ => JsonConvert.DeserializeObject<TResponse>(responseData),
            };
        }

        public async Task<TResponse?> GetAsync<TResponse>(string url)
        {
            using CancellationTokenSource cancellationTokenSource = new(TimeSpan.FromSeconds(16000));

            HttpResponseMessage response = await _httpClient.GetAsync(url, cancellationTokenSource.Token);

            if (cancellationTokenSource.Token.IsCancellationRequested) // O timeout foi atingido e a requisição foi cancelada.
            {
                return default;
            }

            if (response.IsSuccessStatusCode)
            {
                string responseData = await response.Content.ReadAsStringAsync();
                return ConvertResponse<TResponse>(responseData);
            }
            else
            {
                string responseError = await response.Content.ReadAsStringAsync();

                if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                {
                    throw new HttpRequestException(responseError);
                }

                throw new HttpRequestException($"Failed to GET data from {url}. Status code: {response.StatusCode}. \n" + responseError);
            }
        }

        public async Task<TResponse?> PostAsync<TRequest, TResponse>(string url, TRequest data)
        {
            StringContent content = new(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            HttpResponseMessage response = await _httpClient.PostAsync(url, content);

            if (response.IsSuccessStatusCode)
            {
                string responseData = await response.Content.ReadAsStringAsync();
                return ConvertResponse<TResponse>(responseData);
            }
            else
            {
                throw new HttpRequestException($"Failed to POST data to {url}. Status code: {response.StatusCode}");
            }
        }

        public async Task PostAsync<TRequest>(string url, TRequest data)
        {
            StringContent content = new(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            HttpResponseMessage response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"Failed to POST data to {url}. Status code: {response.StatusCode}");
            }
        }

        public async Task<TResponse?> PutAsync<TRequest, TResponse>(string url, TRequest data)
        {
            StringContent content = new(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            HttpResponseMessage response = await _httpClient.PutAsync(url, content);

            if (response.IsSuccessStatusCode)
            {
                string responseData = await response.Content.ReadAsStringAsync();
                return ConvertResponse<TResponse>(responseData);
            }
            else
            {
                throw new HttpRequestException($"Failed to PUT data to {url}. Status code: {response.StatusCode}");
            }
        }

        public async Task<TResponse?> DeleteAsync<TRequest, TResponse>(string url)
        {
            HttpResponseMessage response = await _httpClient.DeleteAsync(url);

            if (response.IsSuccessStatusCode)
            {
                string responseData = await response.Content.ReadAsStringAsync();
                return ConvertResponse<TResponse>(responseData);
            }
            else
            {
                throw new HttpRequestException($"Failed to DELETE data from {url}. Status code: {response.StatusCode}");
            }
        }
    }
}
