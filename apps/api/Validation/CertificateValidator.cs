using CareerPath.Api.Dtos.Certificate;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Validation;

public static class CertificateValidator
{
    public static CertificateRequest Normalize(CertificateRequest request)
    {
        request.Name = TextFieldValidator.RequiredText(request.Name, 200, ErrorCodes.CertificateNameRequired, ErrorCodes.CertificateTextTooLong);
        request.Issuer = TextFieldValidator.RequiredText(request.Issuer, 200, ErrorCodes.CertificateIssuerRequired, ErrorCodes.CertificateTextTooLong);
        request.CredentialId = TextFieldValidator.Text(request.CredentialId, 100, ErrorCodes.CertificateTextTooLong);
        request.VerificationUrl = TextFieldValidator.HttpsUrl(request.VerificationUrl, 300, ErrorCodes.CertificateUrlInvalid);
        if (request.IssueDate is not null && request.ExpiryDate < request.IssueDate)
        {
            throw new ApiException(ErrorCodes.CertificateInvalidDates);
        }
        return request;
    }
}
