using System.Net.Http.Headers;
using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Infrastructure.Supabase;

public class SupabasePrivateStorageClient
{
    private readonly HttpClient httpClient;
    private readonly SupabaseRequestFactory requestFactory;

    public SupabasePrivateStorageClient(HttpClient httpClient, SupabaseRequestFactory requestFactory)
    {
        this.httpClient = httpClient;
        this.requestFactory = requestFactory;
    }

    public async Task UploadAsync(string bucket, string path, byte[] bytes, string contentType, string token, CancellationToken cancellationToken)
    {
        using var request = requestFactory.Create(HttpMethod.Post, $"storage/v1/object/{bucket}/{path}", null, token);
        request.Content = new ByteArrayContent(bytes);
        request.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        using var response = await SendAsync(request, cancellationToken);
    }

    public async Task<(byte[] Bytes, string ContentType)> DownloadAsync(string bucket, string path, string token, CancellationToken cancellationToken)
    {
        using var request = requestFactory.Create(HttpMethod.Get, $"storage/v1/object/authenticated/{bucket}/{path}", null, token);
        using var response = await SendAsync(request, cancellationToken);
        var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken);
        var contentType = response.Content.Headers.ContentType?.MediaType ?? "application/octet-stream";
        return (bytes, contentType);
    }

    public async Task DeleteAsync(string bucket, string path, string token, CancellationToken cancellationToken)
    {
        using var request = requestFactory.Create(HttpMethod.Delete, $"storage/v1/object/{bucket}/{path}", null, token);
        using var response = await SendAsync(request, cancellationToken);
    }

    private async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        try
        {
            var response = await httpClient.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                response.Dispose();
                throw new ApiException(ErrorCodes.PrivateStorageFailed);
            }
            return response;
        }
        catch (HttpRequestException)
        {
            throw new ApiException(ErrorCodes.PrivateStorageFailed);
        }
    }
}
