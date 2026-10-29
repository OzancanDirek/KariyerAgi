using CareerPath.Api.Infrastructure.Supabase;
using CareerPath.Api.Exceptions;
using Microsoft.AspNetCore.Mvc;
using CareerPath.Api.Repositories.Authentication;
using CareerPath.Api.Repositories.Session;
using CareerPath.Api.Repositories.Profile;
using CareerPath.Api.Repositories.CareerProfile;
using CareerPath.Api.Repositories.Experience;
using CareerPath.Api.Repositories.Education;
using CareerPath.Api.Repositories.Certificate;
using CareerPath.Api.Repositories.Project;
using CareerPath.Api.Repositories.Cv;
using CareerPath.Api.Services.Authentication;
using CareerPath.Api.Services.Session;
using CareerPath.Api.Services.Profile;
using CareerPath.Api.Services.CareerProfile;
using CareerPath.Api.Services.Experience;
using CareerPath.Api.Services.Education;
using CareerPath.Api.Services.Certificate;
using CareerPath.Api.Services.Project;
using CareerPath.Api.Services.Cv;
using ExperienceEntity = CareerPath.Api.Entities.Experience;
using EducationEntity = CareerPath.Api.Entities.Education;
using CertificateEntity = CareerPath.Api.Entities.Certificate;
using ProjectEntity = CareerPath.Api.Entities.Project;
using CareerPath.Api.Security;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var messages = context.ModelState
            .Where(entry => entry.Value?.Errors.Count > 0)
            .SelectMany(entry => entry.Value!.Errors.Select(error => $"{entry.Key}: {error.ErrorMessage}"));
        var response = ApiErrorResponseFactory.Create(
            ErrorCodes.Validation,
            context.HttpContext.Request.Path.ToString(),
            string.Join(" ", messages));
        return new BadRequestObjectResult(response);
    };
});
builder.Services.AddSingleton<SupabaseRequestFactory>();
builder.Services.AddHttpClient<SupabaseAuthClient>();
builder.Services.AddHttpClient<SupabaseRestClient>();
builder.Services.AddHttpClient<SupabasePrivateStorageClient>();
builder.Services.AddScoped<ICvRepository, CvRepository>();
builder.Services.AddScoped<ICvService, CvServiceImpl>();
builder.Services.AddScoped<CandidateRecordStore<ExperienceEntity>>();
builder.Services.AddScoped<CandidateRecordStore<EducationEntity>>();
builder.Services.AddScoped<CandidateRecordStore<CertificateEntity>>();
builder.Services.AddScoped<CandidateRecordStore<ProjectEntity>>();
builder.Services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<ICareerProfileRepository, CareerProfileRepository>();
builder.Services.AddScoped<IExperienceRepository, ExperienceRepository>();
builder.Services.AddScoped<IEducationRepository, EducationRepository>();
builder.Services.AddScoped<ICertificateRepository, CertificateRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationServiceImpl>();
builder.Services.AddScoped<ISessionService, SessionServiceImpl>();
builder.Services.AddScoped<HttpRequestContext>();
builder.Services.AddScoped<CurrentUserContextProvider>();
builder.Services.AddScoped<IProfileService, ProfileServiceImpl>();
builder.Services.AddScoped<ICareerProfileService, CareerProfileServiceImpl>();
builder.Services.AddScoped<IExperienceService, ExperienceServiceImpl>();
builder.Services.AddScoped<IEducationService, EducationServiceImpl>();
builder.Services.AddScoped<ICertificateService, CertificateServiceImpl>();
builder.Services.AddScoped<IProjectService, ProjectServiceImpl>();
builder.Services.AddCors(options => options.AddPolicy("web", policy => policy
    .WithOrigins(builder.Configuration["Web:Origin"] ?? "http://localhost:3000")
    .AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseMiddleware<GlobalExceptionHandler>();
app.UseCors("web");
app.MapControllers();
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
app.Run();
