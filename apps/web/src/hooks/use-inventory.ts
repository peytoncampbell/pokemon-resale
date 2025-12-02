import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi, type AddInventoryRequest } from '@/lib/api'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export function useInventoryItems(status?: string, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['inventory', 'items', { status, page, pageSize }],
    queryFn: () => inventoryApi.getItems({ orgId: ORG_ID, status, page, pageSize }),
  })
}

export function useAddInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<AddInventoryRequest, 'orgId'>) =>
      inventoryApi.addItem({ ...data, orgId: ORG_ID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'items'] })
      queryClient.invalidateQueries({ queryKey: ['inventory', 'value'] })
    },
  })
}

export function useInventoryValue() {
  return useQuery({
    queryKey: ['inventory', 'value'],
    queryFn: () => inventoryApi.calculateValue(ORG_ID),
  })
}
