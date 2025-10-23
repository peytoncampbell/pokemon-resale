using Infrastructure;
using Microsoft.EntityFrameworkCore;

public static class PricingAndListingsEndpoints
{
    public static IEndpointRouteBuilder MapPricingAndListings(this IEndpointRouteBuilder app)
    {
        // POST: /api/v0/pricing/evaluate
        app.MapPost("/api/v0/pricing/evaluate", async (AppDbContext db, IConfiguration cfg, Guid[] inventoryItemIds) =>
        {
            var markup = cfg.GetSection("Pricing").GetValue<decimal>("DefaultMarkup", 1.5m);
            var floor = cfg.GetSection("Pricing").GetValue<decimal>("Floor", 1.0m);

            var items = await db.InventoryItems.Where(i => inventoryItemIds.Contains(i.Id)).ToListAsync();

            var results = items.Select(i => new
            {
                inventoryItemId = i.Id,
                price = Math.Max(decimal.Round(i.AcquisitionCost * markup, 2), floor),
                currency = "CAD"
            });

            return Results.Ok(new { results });
        });

        // POST: /api/v0/listings
        app.MapPost("/api/v0/listings", async (AppDbContext db, Contracts.CreateListingRequest[] items) =>
        {
            foreach (var it in items)
            {
                var inv = await db.InventoryItems.FindAsync(it.InventoryItemId);
                if (inv is null || inv.Status != "ACTIVE")
                    return Results.BadRequest(new { message = $"Item {it.InventoryItemId} not listable" });

                db.Listings.Add(new Domain.Listing
                {
                    OrgId = inv.OrgId,
                    InventoryItemId = inv.Id,
                    Price = it.Price,
                    Currency = string.IsNullOrWhiteSpace(it.Currency) ? "CAD" : it.Currency,
                    Status = "ACTIVE",
                    Channel = "INTERNAL"
                });
            }

            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // GET: /api/v0/listings
        app.MapGet("/api/v0/listings", async (AppDbContext db, Guid? orgId, string? status) =>
        {
            var org = orgId ?? Guid.Parse("00000000-0000-0000-0000-000000000001");
            var q = db.Listings.Where(l => l.OrgId == org);
            if (!string.IsNullOrWhiteSpace(status))
                q = q.Where(l => l.Status == status);

            var rows = await q.OrderByDescending(l => l.CreatedAt).ToListAsync();
            return Results.Ok(rows);
        });

        return app;
    }
}