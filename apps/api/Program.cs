using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => c.SwaggerDoc("v0", new OpenApiInfo{ Title="Pokemon Resale API", Version="v0"}));
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();
app.UseSwagger().UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v0/swagger.json","v0"));

app.MapGet("/healthz", () => Results.Ok(new { ok = true, at = DateTime.UtcNow }));

app.MapGet("/api/v0/cards", async (AppDbContext db, string? search) => {
  var q = db.Cards.AsQueryable();
  if (!string.IsNullOrWhiteSpace(search))
    q = q.Where(c => EF.Functions.ILike(c.Name, $"%{search}%"));
  return Results.Ok(await q.Take(100).ToListAsync());
});

await using (var scope = app.Services.CreateAsyncScope()) {
  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
  await db.Database.MigrateAsync();
  if (!await db.Organizations.AnyAsync()) {
    var orgId = Guid.Parse("00000000-0000-0000-0000-000000000001");
    db.Organizations.Add(new Domain.Organization { Id = orgId, Name = "Dev Org" });
    db.Locations.AddRange(Enumerable.Range(1,10).Select(i => new Domain.Location{ OrgId = orgId, Name = $"BIN-{i:00}", Type = "BIN" }));
    db.Cards.Add(new Domain.Card{ SetCode="SV1", Number="001", Name="Sprigatito", Rarity="Common" });
    await db.SaveChangesAsync();
  }
}

app.MapInventory();
app.MapPricingAndListings();
app.Run();
