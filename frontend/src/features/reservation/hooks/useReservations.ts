import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reservationApi } from '../api/reservation.api'
import type { CreateReservationInput } from '../types/reservation.types'

export const reservationKeys = { all: ['reservations'] as const, mine: ['reservations', 'mine'] as const }
export const useMyReservations = () => useQuery({ queryKey: reservationKeys.mine, queryFn: reservationApi.listMine })
export const useOperationsReservations = (enabled: boolean) => useQuery({ queryKey: [...reservationKeys.all, 'operations'], queryFn: reservationApi.listOperations, enabled })
export const useCreateReservation = () => { const client = useQueryClient(); return useMutation({ mutationFn: (input: CreateReservationInput) => reservationApi.create(input), onSuccess: () => client.invalidateQueries({ queryKey: reservationKeys.all }) }) }
export const useSimulatePayment = () => { const client = useQueryClient(); return useMutation({ mutationFn: reservationApi.simulatePayment, onSuccess: () => client.invalidateQueries({ queryKey: reservationKeys.all }) }) }
export const useUpdateReservationStatus = () => { const client = useQueryClient(); return useMutation({ mutationFn: reservationApi.updateStatus, onSuccess: () => client.invalidateQueries({ queryKey: reservationKeys.all }) }) }
