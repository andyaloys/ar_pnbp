using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ArManagement.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Connection Strings & DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var serverVersion = new MySqlServerVersion(new Version(8, 0, 36));

builder.Services.AddDbContext<ArDbContext>(options =>
{
    options.UseMySql(connectionString, serverVersion, mySqlOptions =>
    {
        mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
    });
});

// 2. Business Services (Clean Architecture DI)
builder.Services.AddScoped<ArManagement.Api.Services.Aging.IAgingEngineService, ArManagement.Api.Services.Aging.AgingEngineService>();
builder.Services.AddScoped<ArManagement.Api.Services.Piutang.IPiutangService, ArManagement.Api.Services.Piutang.PiutangService>();
builder.Services.AddScoped<ArManagement.Api.Services.Dashboard.IDashboardService, ArManagement.Api.Services.Dashboard.DashboardService>();
builder.Services.AddScoped<ArManagement.Api.Services.Sakti.ISaktiIntegrationService, ArManagement.Api.Services.Sakti.SaktiIntegrationService>();
builder.Services.AddScoped<ArManagement.Api.Services.Auth.IAuthService, ArManagement.Api.Services.Auth.AuthService>();
builder.Services.AddScoped<ArManagement.Api.Services.Users.IUserService, ArManagement.Api.Services.Users.UserService>();

// 3. CORS Policy for Angular Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4201", "http://localhost:4205", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 3. Controllers and JSON formatting
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// 4. OpenAPI / Swagger Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AR Management PNBP API (KLH/BPLH)",
        Version = "v1",
        Description = "API Sistem Penguatan Pengelolaan Piutang PNBP Lingkup KLH/BPLH & Fondasi Integrasi SAKTI 2026",
        Contact = new OpenApiContact
        {
            Name = "Biro Perencanaan dan Keuangan Settama / Pusdatin",
            Email = "keuangan@menlhk.go.id"
        }
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Masukkan token JWT dengan format: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AR Management PNBP API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontendApp");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
