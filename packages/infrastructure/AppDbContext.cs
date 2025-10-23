using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;
public class AppDbContext(DbContextOptions<AppDbContext> opt) : DbContext(opt) {
  public DbSet<Organization> Organizations => Set<Organization>();
  public DbSet<Card> Cards => Set<Card>();
  public DbSet<Location> Locations => Set<Location>();
  public DbSet<ProcurementOrder> ProcurementOrders => Set<ProcurementOrder>();
  public DbSet<ProcurementLine> ProcurementLines => Set<ProcurementLine>();
  public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();
  public DbSet<Listing> Listings => Set<Listing>();

  protected override void OnModelCreating(ModelBuilder b) {
    b.Entity<Card>().Property(x => x.AttributesJson).HasColumnType("jsonb");
    b.Entity<InventoryItem>().Property(x => x.PhotosJson).HasColumnType("jsonb");

    b.Entity<Card>().HasIndex(x => new { x.SetCode, x.Number });
    b.Entity<InventoryItem>().HasIndex(x => new { x.OrgId, x.Status });
    b.Entity<Listing>().HasIndex(x => new { x.OrgId, x.Status });
  }
}