const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v0'

export interface InventoryItem {
  id: string
  orgId: string
  cardId: string
  condition: string
  grade?: number
  acquisitionCost: number
  locationId: string
  location?: {
    id: string
    name: string
  }
  status: 'IN_STOCK' | 'LISTED' | 'SOLD' | 'DAMAGED'
  photos?: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface InventoryListResponse {
  items: InventoryItem[]
  total: number
  page: number
  pageSize: number
}

export interface AddInventoryRequest {
  orgId: string
  cardId: string
  condition: string
  grade?: number
  acquisitionCost: number
  locationId: string
  photos?: string[]
  notes?: string
}

export const inventoryApi = {
  async getItems(params: {
    orgId: string
    status?: string
    page?: number
    pageSize?: number
  }): Promise<InventoryListResponse> {
    const queryParams = new URLSearchParams({
      orgId: params.orgId,
      ...(params.status && { status: params.status }),
      page: String(params.page || 1),
      pageSize: String(params.pageSize || 20),
    })

    const response = await fetch(`${API_BASE_URL}/inventory/items?${queryParams}`)

    if (!response.ok) {
      throw new Error('Failed to fetch inventory items')
    }

    return response.json()
  },

  async addItem(data: AddInventoryRequest): Promise<InventoryItem> {
    const response = await fetch(`${API_BASE_URL}/inventory/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to add inventory item')
    }

    return response.json()
  },

  async calculateValue(orgId: string): Promise<{ totalValue: number }> {
    const response = await fetch(`${API_BASE_URL}/inventory/value?orgId=${orgId}`)

    if (!response.ok) {
      throw new Error('Failed to calculate inventory value')
    }

    return response.json()
  },
}
