namespace Domain;
public abstract class Entity { public Guid Id { get; init; } = Guid.NewGuid(); public DateTime CreatedAt { get; init; } = DateTime.UtcNow; }

public class Organization : Entity { public string Name { get; set; } = ""; public string Plan { get; set; } = "internal"; }

public class Card : Entity {
  public string SetCode { get; set; } = "";
  public string Number { get; set; } = "";
  public string Name { get; set; } = "";
  public string Rarity { get; set; } = "";
  public string? AttributesJson { get; set; }
}

public class Location : Entity { public Guid OrgId { get; set; } public string Name { get; set; } = ""; public string Type { get; set; } = "BIN"; }

public class ProcurementOrder : Entity {
  public Guid OrgId { get; set; }
  public string Supplier { get; set; } = "";
  public string Status { get; set; } = "DRAFT";
  public decimal Subtotal { get; set; }
  public decimal Shipping { get; set; }
  public decimal Fees { get; set; }
  public decimal Total { get; set; }
  public string? Notes { get; set; }
  public List<ProcurementLine> Lines { get; set; } = new();
}
public class ProcurementLine : Entity { public Guid OrderId { get; set; } public Guid CardId { get; set; } public int Qty { get; set; } public decimal UnitCost { get; set; } public string? Notes { get; set; } }

public class InventoryItem : Entity {
  public Guid OrgId { get; set; }
  public Guid CardId { get; set; }
  public string Condition { get; set; } = "NM";
  public string? Grade { get; set; }
  public decimal AcquisitionCost { get; set; }
  public Guid LocationId { get; set; }
  public string Status { get; set; } = "ACTIVE";
  public string? PhotosJson { get; set; }
}

public class Listing : Entity {
  public Guid OrgId { get; set; }
  public Guid InventoryItemId { get; set; }
  public decimal Price { get; set; }
  public string Currency { get; set; } = "CAD";
  public string Status { get; set; } = "ACTIVE";
  public string Channel { get; set; } = "INTERNAL";
}
