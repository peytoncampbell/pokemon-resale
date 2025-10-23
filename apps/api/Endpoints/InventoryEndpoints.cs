using Contracts;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

public static class InventoryEndpoints
{
    public static IEndpointRouteBuilder MapInventory(this IEndpointRouteBuilder app)
    {
        // GET: /api/v0/inventory/items
        app.MapGet("/api/v0/inventory/items", async (AppDbContext db, Guid? orgId, string? status, int page = 1, int pageSize = 50) =>
        {
            var org = orgId ?? Guid.Parse("00000000-0000-0000-0000-000000000001");
            var q = db.InventoryItems.Where(i => i.OrgId == org);
            if (!string.IsNullOrWhiteSpace(status))
                q = q.Where(i => i.Status == status);

            var items = await q
                .OrderByDescending(i => i.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Results.Ok(items.Select(i => new InventoryItemResponse(i.Id, i.CardId, i.Status, i.AcquisitionCost)));
        });

        // POST: /api/v0/inventory/items
        app.MapPost("/api/v0/inventory/items", async (AppDbContext db, CreateInventoryItemRequest req) =>
        {
            var item = new Domain.InventoryItem
            {
                OrgId = req.OrgId,
                CardId = req.CardId,
                Condition = req.Condition,
                Grade = req.Grade,
                AcquisitionCost = req.AcquisitionCost,
                LocationId = req.LocationId,
                Status = "ACTIVE",
                PhotosJson = req.Photos is { Length: > 0 } ? System.Text.Json.JsonSerializer.Serialize(req.Photos) : null
            };

            db.InventoryItems.Add(item);
            await db.SaveChangesAsync();

            return Results.Created($"/api/v0/inventory/items/{item.Id}",
                new InventoryItemResponse(item.Id, item.CardId, item.Status, item.AcquisitionCost));
        });

        // PATCH: /api/v0/inventory/items/{id}/move
        app.MapPatch("/api/v0/inventory/items/{id:guid}/move", async (AppDbContext db, Guid id, Guid locationId) =>
        {
            var item = await db.InventoryItems.FindAsync(id);
            if (item is null) return Results.NotFound();

            item.LocationId = locationId;
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        return app;
    }
}