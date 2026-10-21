import { api } from '@/lib/axios'
import type { CreateReservationInput, Reservation } from '../types/reservation.types'

export const reservationApi = {
  create: async (input: CreateReservationInput): Promise<Reservation> => (await api.post<{ data: Reservation }>('/reservations', input)).data.data,
  listMine: async (): Promise<Reservation[]> => (await api.get<{ data: Reservation[] }>('/reservations')).data.data ?? [],
  listOperations: async (): Promise<Reservation[]> => (await api.get<{ data: Reservation[] }>('/reservations/manage')).data.data ?? [],
  simulatePayment: async (id: string): Promise<Reservation> => (await api.post<{ data: Reservation }>(`/reservations/${id}/payment/simulate`)).data.data,
  updateStatus: async ({ id, status, returnCondition, returnNotes }: { id: string; status: 'checked_out' | 'cancelled' | 'completed'; returnCondition?: 'good' | 'damaged'; returnNotes?: string }): Promise<Reservation> => (await api.patch<{ data: Reservation }>(`/reservations/${id}/status`, { status, returnCondition, returnNotes })).data.data,
}
