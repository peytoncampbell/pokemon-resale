namespace Contracts;

public record CreateInventoryItemRequest(
  Guid OrgId,
  Guid CardId,
  string Condition,
  string? Grade,
  decimal AcquisitionCost,
  Guid LocationId,
  string[]? Photos
);

public record InventoryItemResponse(Guid Id, Guid CardId, string Status, decimal AcquisitionCost);

public record CreateListingRequest(Guid InventoryItemId, decimal Price, string Currency);
