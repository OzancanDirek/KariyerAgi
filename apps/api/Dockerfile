FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source
COPY apps/api/CareerPath.Api.csproj apps/api/
RUN dotnet restore apps/api/CareerPath.Api.csproj
COPY apps/api/ apps/api/
RUN dotnet publish apps/api/CareerPath.Api.csproj -c Release --no-restore -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000
USER $APP_UID
ENTRYPOINT ["dotnet", "CareerPath.Api.dll"]
